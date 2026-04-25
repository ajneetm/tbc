import { updateChatTrailing } from "@/store/chatbot/ChatController";
import { sendMsg, updateAnswerId } from "@/store/chatbot/ChatSlice";
import {
  addSurveyAnswer,
  updateSurveyAnswer,
  updateSurveyFlow,
} from "@/store/chatbot/SurveyFlow";
import { ExcludedSurveyType } from "@/store/chatbot/SurveyFlowTypes";
import { useDispatch, useSelector } from "@/store/hooks";
import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import sleep from "@/utils/sleep";
import { cva } from "class-variance-authority";
import { v4 as uuid } from "uuid";
import { surveyAnswers, surveyFlows } from "../constants";

export const surveyVariants = cva(
  ["w-full rounded-lg  px-4 py-[10px] ", "text-pretty "],
  {
    variants: {
      variant: {
        user: "self-end bg-[#F04438] text-white rounded-se-none text-end",
        chatbot:
          "border border-[#E4E7EC] bg-[#F9FAFB] text-[#101828] rounded-ss-none text-start",
      },
    },
  },
);

export type SurveyMessageProps = {
  msgSender: MsgSender;
  questionId: string;
  submittedAnswerId?: string;
  chatId: string;
  surveyId: string | null;
};
function SurveyMessage({
  msgSender,
  questionId,
  submittedAnswerId,
  chatId,
  surveyId,
}: SurveyMessageProps) {
  const {
    surveyDetails: { status, activeSurveyId },
    type,
  } = useSelector((state) => state.surveyFlow);
  const { language } = useSelector((state) => state.assessmentForm);

  
  const selectedSurveyAnswers = surveyFlows[type as ExcludedSurveyType];

  const questionIndex = selectedSurveyAnswers.findIndex(
    (q) => q.id === questionId,
  );
  const currentQuestion = selectedSurveyAnswers[questionIndex];
  const nextQuestion = selectedSurveyAnswers[questionIndex + 1];
  const dispatch = useDispatch();

  const newAnswer = async (answerId: string, score: number) => {
    dispatch(updateAnswerId({ answerId, chatId }));
    dispatch(
      addSurveyAnswer({
        answer: {
          id: uuid(),
          question: currentQuestion?.question,
          score: score,
          rate: currentQuestion?.rate || 0,
          answerId,
          modalId: currentQuestion?.modalId || "",
          questionId,
        },
      }),
    );
    await sleep(500);
    if (nextQuestion) {
      // If there is a next question, send it
      dispatch(
        sendMsg({
          message: {
            id: uuid(),
            msgType: "survey",
            questionId: nextQuestion?.id,
            surveyId: activeSurveyId,
            msgSender: "chatbot",
            msg_body: "",
          },
        }),
      );
    } else {
      // If there is no next question, send a survey end message
      dispatch(updateChatTrailing("end-survey"));
    }
  };
  const updateAnswer = async (answerId: string, score: number) => {
    dispatch(updateAnswerId({ answerId, chatId }));
    dispatch(updateSurveyAnswer({ answerId, score, questionId }));
  };
  const handleAnswer = async (answerId: string, score: number) => {
    if (submittedAnswerId && status === "inProgress") {
      updateAnswer(answerId, score);
      return;
    }
    newAnswer(answerId, score);
  };
  // surveyId !== activeSurveyId this check is to make sure that the survey message is disabled when the active survey id is not the same as the survey id
  const isAnswerDisabled = surveyId !== activeSurveyId || status === "idle";
  return (
    <div id={chatId} className={cn(surveyVariants({ variant: msgSender }))}>
      <p>
        {language === "en"
          ? currentQuestion?.question
          : currentQuestion?.question_ar}
      </p>
      <div className="mt-2 flex w-full gap-[10px] max-md:flex-wrap">
        {[...surveyAnswers].reverse().map((answer) => (
          <button
            disabled={isAnswerDisabled}
            onClick={() => handleAnswer(answer.id, answer.score)}
            key={answer.id}
            className={cn(
              "w-full rounded-md bg-[#F2F4F7] px-[14px] py-[10px] text-center text-[#182230]",
              {
                "hover:!outline hover:outline-2 hover:outline-[#F04438]":
                  !isAnswerDisabled,
                "!outline outline-2 outline-[#F04438]":
                  answer.id === submittedAnswerId,
              },
            )}
          >
            {language === "en" ? answer.title : answer.title_ar}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SurveyMessage;
