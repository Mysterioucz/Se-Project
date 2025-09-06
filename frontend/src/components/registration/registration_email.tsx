export default function RegistrationEmail() {
  return (
      <div className="flex flex-col justify-center gap-8 w-[32.5rem]">
        {/* Top Part */}
        <p className="text-[2.5rem] font-medium text-primary-900">
          Create an account
        </p>

        {/* Middle Part */}
        <div className="flex flex-col gap-2">
          {/* Email Part */}
          <div className="flex flex-col gap-3">
            <p className="text-[1.125rem] font-semibold text-primary-900">
              Email Address*
            </p>
            <div className="flex gap-2.5 p-4 h-[3.1875rem] border-1 border-gray-200 rounded-sm items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
              />
            </div>
          </div>
          {/* CheckBox Part */}
          <div className="flex items-center gap-2 py-2 px-2.5">
            <input
              type="checkbox"
              id="terms"
              className="w-5 h-5 accent-primary-400"
            />
            <p className="text-[0.875rem] text-primary-400">
              Yes, I would like Fly with Sigma to send me info about new
              promotion, events, or other related-content.
            </p>
          </div>
        </div>

        {/* Bottom Part */}
        <div className="flex justify-center">
          <button className="w-[7rem] h-[2.1875rem] bg-primary-400 rounded-md items-center justify-center text-white text-[16px]">
            Next
          </button>
        </div>
      </div>
  );
}