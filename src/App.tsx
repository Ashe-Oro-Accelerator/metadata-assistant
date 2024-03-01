import { dictionary } from '@/libs/en';

const App = () => {
  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.test}</h1>
      <p className="text-center leading-7 [&:not(:first-child)]:mt-6">{dictionary.test}</p>
      <div className="mt-10 flex items-center justify-center gap-2"></div>
    </div>
  );
};

export default App;
