import ExternalLinkIcon from "src/assets/externalLink.svg?react";

import styles from "./ExternalLinkWithIcon.module.scss";

interface ExternalLinkWithIconProps {
  link: string | undefined;
}

const ExternalLinkWithIcon = ({ link }: ExternalLinkWithIconProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return link ? (
    <a
      href={link}
      target='_blank'
      rel='noreferrer'
      className={styles.externalLinkWithIcon}
      onClick={handleClick}
    >
      <ExternalLinkIcon />
    </a>
  ) : null;
};

export default ExternalLinkWithIcon;
