import { ComponentPropsWithoutRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

import { useChatContext } from '@/contexts/chat.provider';

type FormStateType = {
  message: string;
};

type IProps = ComponentPropsWithoutRef<'form'>;
function ChatInput(props: IProps) {
  const { sendMessage } = useChatContext();
  const { control, handleSubmit, reset } = useForm<FormStateType>({
    defaultValues: {
      message: '',
    },
  });
  const onSubmit: SubmitHandler<FormStateType> = async (
    payload: FormStateType
  ) => {
    sendMessage(payload.message);
    reset();
  };
  return (
    <form className="w-full flex" onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="relateive w-full bg-white grid grid-cols-12 rounded-md px-4 box-border">
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <input
              className="bg-transparent outline-none border-none col-span-11 text-black text-sm"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        ></Controller>
        <button
          className="w-100 col-span-1 text-sky-700 hover:text-sky-500 flex justify-end"
          type="submit"
        >
          <PaperAirplaneIcon className="w-10 h-10" />
        </button>
      </div>
    </form>
  );
}
export default ChatInput;
