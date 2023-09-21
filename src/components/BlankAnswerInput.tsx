import { useMemo } from 'react';
import keyword_extractor from 'keyword-extractor';

export interface IBlankAnswerInputProps {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
}

const BLANKS = '_____';

export default function BlankAnswerInput({
  answer,
  setBlankAnswer,
}: IBlankAnswerInputProps) {
  const keyWords = useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: 'english',
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });

    const shuffled = words.sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = useMemo(() => {
    const transformed = keyWords.reduce(
      (acc, keyword) => acc.replace(keyword, BLANKS),
      answer,
    );
    setBlankAnswer(transformed);
    return transformed;
  }, [keyWords, answer, setBlankAnswer]);

  return (
    <div className='flex justify-start w-full mt-4'>
      <h1 className='text-xl font-semibold'>
        {answerWithBlanks.split(BLANKS).map((part, index) => (
          <>
            {part}
            {index === answerWithBlanks.split(BLANKS).length - 1 ? (
              ''
            ) : (
              <input
                id={`user-blank-input`}
                className='text-center border-b-2 border-black dark:border-white w-28 focus:border-b-4 focus:outline-none'
              />
            )}
          </>
        ))}
      </h1>
    </div>
  );
}
