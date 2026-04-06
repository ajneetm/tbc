"use client";

import { useDispatch, useSelector } from "@/store/hooks";
import { useEffect } from "react";
import AssessmentForm from "./Form";
import Survey from "./Survey";
import {

  updateAssessmentStarted,
} from "@/store/assessmentForm/AssessmentForm";
import { handleNewChat } from "../chatbot/helpers/chats";

function AssessmentController() {
  const { isAssessmentStarted } = useSelector((state) => state.assessmentForm);
  const dispatch = useDispatch();

  const resetAssessmentForm = () => {
    dispatch(updateAssessmentStarted(false));
  };

  useEffect(() => {
    // Perform any necessary side effects when the component mounts
    return () => {
      handleNewChat(dispatch);
      resetAssessmentForm();
    };
  }, []);

  return isAssessmentStarted ? <Survey /> : <AssessmentForm />;
}

export default AssessmentController;
