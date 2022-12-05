import { cx } from "class-variance-authority";

interface Props {
  url: string;
  className?: string;
}

export function Avatar({ url, className }: Props) {
  return <img src={url} className={cx("rounded-full", className)} />;
}
