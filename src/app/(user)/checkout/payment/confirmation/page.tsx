export default function Page() {
  return (

    <div className="flex flex-col w-full justify-center gap-10">
        <h1 className="font-sarabun text-[2rem] font-bold leading-[120%] text-primary-600">
            Flight Order Summary
        </h1>

        <div className="flex items-start gap-16 self-stretch">
            <div className="flex flex-col items-start gap-[0.625rem] w-[35rem] p-[1rem]">
                <div className="flex items-start self-stretch px-4 py-2 rounded-md bg-primary-50">
                    <div className="font-sarabun text-[1rem] font-semibold leading-[120%] text-primary-900 m-0">
                        Type Trip : One-Way
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-[4rem] self-stretch">
                {/* add more children here */}
            </div>

            <div className="flex flex-col items-start gap-[1rem] [flex:1_0_0] bg-blue-100 p-[1rem]">
                <p>Some content</p>
            </div>
        </div>
    </div>


  );
}
