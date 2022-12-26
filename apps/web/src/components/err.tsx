interface Props {
  statusCode: number;
  description: string;
}

export default function Err({ statusCode, description }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
      <h1 className="bg-gradient-to-b from-gray-900 to-gray-900/60 bg-clip-text text-center text-4xl font-bold text-transparent dark:from-gray-100 dark:to-gray-100/50 md:text-6xl">
        {statusCode}
      </h1>

      <p className="text-xl text-gray-600 dark:text-gray-400 md:w-1/2 md:text-2xl">
        {description}
      </p>
    </div>
  );
}
