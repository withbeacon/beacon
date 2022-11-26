import { cx } from "class-variance-authority";

export interface Option {
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
    <div
      className={cx(
        "flex w-full items-center",
        options && "hide-scrollbar overflow-scroll"
      )}
    >
      <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
        {title}
      </h2>
      {options && (
        <div className="ml-6 flex gap-4 text-base font-medium md:ml-auto">
          {options.map(({ active, title, onClick }) => (
            <button
              key={title}
              onClick={() => onClick()}
              className={cx(
                active ? "text-gray-800" : "font-normal text-gray-600",
                "outline-none transition-colors duration-200 hover:text-gray-800"
              )}
            >
              {title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
