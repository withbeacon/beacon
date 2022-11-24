import { cx } from "class-variance-authority";

interface Option {
  title: string;
  active: boolean;
  onClick: () => void;
}

interface Props {
  title: string;
  options?: Option[];
}

export function MetricsHeader({ title, options }: Props) {
  return (
    <div className="flex items-center w-full">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
      <div className="ml-auto flex gap-4 text-base font-medium">
        {options && options.map(({ active, title, onClick }) => (
          <button
            key={title}
            onClick={() => onClick()}
            className={cx(
              active ? "text-gray-800" : "text-gray-600 font-normal",
              "transition-colors duration-200 hover:text-gray-800 outline-none"
            )}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}
