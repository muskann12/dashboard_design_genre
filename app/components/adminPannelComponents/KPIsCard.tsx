interface KPIsCard {
  title: string;
  value: string;
  icon: JSX.Element;
}
export default function KPIsCard({ title, value, icon }: KPIsCard) {
  return (
    <div className="bg-blue-950 px-6 py-3 rounded-lg shadow-2xl flex flex-col justify-start">
      <div className="bg-gray-500 border border-gray-200 rounded-full p-3 h-[40px] w-[40px] flex justify-center items-center">
        <div className="">{icon}</div>
      </div>
      <div className="mt-3">
        <p className="text-[20px] font-satoshiBold font-bold text-white">
          {value}
        </p>
        <div className="flex justify-between w-full mt-2">
          <p className="text-[14px] font-satoshi font-normal text-white/55">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
