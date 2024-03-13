import Button from '@/components/Button';

export default function Home() {
  return (
    <>
      <div className="flex items-center w-full h-screen justify-center">
        <div className="flex flex-col w-full p-5 gap-4 text-center">
          <h1>Welcome here...!</h1>
          <Button as="a" label="Login" md href="/login"/>
          <Button as="a" label="Register" md href="/register" />
        </div>
      </div>
    </>
  );
}
