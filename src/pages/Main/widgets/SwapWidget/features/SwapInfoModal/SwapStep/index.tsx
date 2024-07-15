import { CircularProgress } from "@mui/material";

import styles from "./SwapStep.module.scss";

interface SwapStepProps {
  stepNumber: number;
  isCompleted: boolean;
  isActive: boolean;
  description: string;
  link?: string;
  isLoading?: boolean;
}

const SwapStep = ({ stepNumber, isCompleted, isActive, description, link, isLoading }: SwapStepProps) => {
  return (
    <div className={`${styles.step} ${isCompleted ? styles.completed : ""} ${isActive ? styles.active : ""}`}>
      <div className={styles.stepIcon}>{isLoading ? <CircularProgress size={24} /> : isCompleted ? <>✅</> : null}</div>
      <div className={styles.stepData}>
        <h4>Step {stepNumber}</h4>
        <p>{description}</p>
        {link && (
          <a
            href={link}
            target='_blank'
            rel='noreferrer noopener'
            className={styles.link}
          >
            Why is it necessary?
          </a>
        )}
      </div>
    </div>
  );
};

export default SwapStep;
