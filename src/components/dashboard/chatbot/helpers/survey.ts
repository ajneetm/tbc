"use client";
import { sendSurveyDetails } from "@/app/libs/api/chat";
import { updateChatTrailing } from "@/store/chatbot/ChatController";
import { payloadType, sendMsg } from "@/store/chatbot/ChatSlice";
import { updateSurveyFlow } from "@/store/chatbot/SurveyFlow";
import { AppDispatch } from "@/store/store";
import { SurveyAnswer } from "@/types/chat";
import sleep from "@/utils/sleep";
import html2canvas from "html2canvas";
import { v4 as uuid } from "uuid";
import { endSurveyMessages, START_SURVEY_MESSAGE } from "../constants";
import { ModalScore } from "../MessageTemplates/SurveyResult";
import { PRINT_RESULT_AREA } from "../MessageTemplates/constents";
import { startBooking } from "./booking";
import toast from "react-hot-toast";
import { SurveyType } from "@/store/chatbot/SurveyFlowTypes";

export function triggerSurveySequence(
  dispatch: AppDispatch,
  isChatbot = true,
  lang: "en" | "ar" = "en",
) {
  return async () => {
    if (isChatbot) {
      dispatch(
        sendMsg({
          message: {
            msgType: "text",
            msgSender: "user",
            id: uuid(),
            msg_body: "Test your business and get free consultation",
          },
        }),
      );
      await sleep(1000);
    }
    dispatch(
      sendMsg({
        message: {
          msgType: "text",
          msgSender: "chatbot",
          id: uuid(),
          msg_body: START_SURVEY_MESSAGE[lang],
        },
      }),
    );
    await sleep(500);
    dispatch(updateChatTrailing("new-survey"));
  };
}

type surveyPayload = {
  totalScore: string;
  surveyDetails: SurveyAnswer[];
  name: string;
  email: string;
  phone: string;
  surveyType?: SurveyType;
  age?: string;
  businessType?: string;
  capital?: string;
  projectAge?: string;
  staffCount?: string;
};
export const handleSurveyDetails = async ({
  totalScore,
  surveyDetails,
  name,
  email,
  phone,
  surveyType,
  age,
  businessType,
  capital,
  projectAge,
  staffCount,
}: surveyPayload) => {
  const html = document.getElementById(PRINT_RESULT_AREA);
  if (html) {
    try {
      // Force eager loading of images. Known issue with html2canvas
      // https://github.com/niklasvh/html2canvas/issues/3053
      Array.from(html.querySelectorAll('img'))?.forEach((img) => {
        if (img.getAttribute('loading') === 'lazy') img.setAttribute('loading', 'eager')
      });
      const canvas = await html2canvas(html, {
        useCORS: true,
        allowTaint: true,
        logging: true,
        height: html.clientHeight || window.innerHeight,
        width: html.clientWidth || window.innerWidth,
        ignoreElements: (el) =>
            el.nodeName.toLowerCase() === 'canvas' ||
            el.getAttribute('loading') === 'lazy'
      });
      // Try toBlob first, fallback to toDataURL if it fails
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) {
            resolve(blob);
          } else {
            // Fallback to toDataURL for Safari
            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: 'image/png' });
            resolve(blob);
          }
        }, 'image/png');
      });
      if (blob) {
        const file = new File([blob], "survey-result.png", {
          type: "image/png",
        });
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("score", totalScore);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("type", String(surveyType));
        if (businessType)
          formData.append("business_type", String(businessType));
        if (age) formData.append("age", String(age));
        if (capital) formData.append("capital", String(capital));
        if (projectAge) formData.append("project_age", String(projectAge));
        if (staffCount) formData.append("staff_count", String(staffCount));

        formData.append("data", JSON.stringify(surveyDetails));
        const res = await sendSurveyDetails(formData);
        return res.id;
      }
    } catch (error) {
      console.error("error", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }
};

export async function handleSurveyCompletion({
  activeSurveyId,
  dispatch,
  totalScore,
  surveyDetails,
  name,
  email,
  phone,
  language,
  surveyType,
  age,
  businessType,
  capital,
  projectAge,
  staffCount,
}: {
  activeSurveyId: string | null;
  language: "en" | "ar";
  dispatch: AppDispatch;
} & surveyPayload) {
  const endSurveyMessagesBody =
    language === "en"
      ? "Thank you for completing the survey, now let's review your business strength & weaknesses"
      : "شكرا لك على اكمال الاستبيان، الان ننظر لنقاط القوة والضعف في عملك";
  const endSurveyMessage: payloadType["message"] = {
    id: uuid(),
    msgType: "text",
    msgSender: "chatbot",
    msg_body: endSurveyMessagesBody,
  };
  // dispatch(
  //   sendMsg({
  //     message: {
  //       ...endSurveyMessage,
  //     },
  //   }),
  // );

  const endSurveyResultMessage: payloadType["message"] = {
    id: activeSurveyId || uuid(),
    msgType: "result",
    msgSender: "chatbot",
    msg_body: "",
  };

  dispatch(
    sendMsg({
      message: {
        ...endSurveyResultMessage,
      },
    }),
  );

  await sleep(200);

  const surveyId = await handleSurveyDetails({
    totalScore,
    surveyDetails,
    name,
    email,
    phone,
    surveyType,
    age,
    businessType,
    capital,
    projectAge,
    staffCount,
  });

  dispatch(
    updateSurveyFlow({
      status: "idle",
      activeSurveyId: null,
    }),
  );
  return surveyId;
  // await startBooking(dispatch);
}
export function calculateTestResults(submittedAnswers: SurveyAnswer[]) {
  const modalScore = submittedAnswers.reduce<ModalScore[]>((acc, answer) => {
    const modal = acc.find((a) => a.modalId === answer.modalId);
    if (modal) {
      modal.modalScore += answer.score * answer.rate;
    } else {
      acc.push({
        modalScore: answer.score * answer.rate,
        modalId: answer.modalId,
        label: "",
      });
    }
    return acc;
  }, []);

  const totalScore = modalScore.reduce(
    (acc, modal) => acc + modal.modalScore,
    0,
  );
  return { totalScore, modalScore };
}
