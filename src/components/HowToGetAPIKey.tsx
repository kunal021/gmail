/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

function HowToGetAPIKey() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center h-full m-20 space-y-20">
        <p>
          Go to{" "}
          <Link
            href={"https://ai.google.dev/"}
            className="underline text-blue-500"
          >
            This Website
          </Link>
        </p>
        <div className="flex flex-col justify-center items-center space-y-5">
          <p>
            Click on{" "}
            <span className="underline">Get API Key in Google AI Studio</span>
          </p>
          <img
            src="/Screenshot 2024-06-09 142709.png"
            alt="api-key"
            className="md:h-80 md:w-[720px]"
          ></img>
        </div>
        <div className="flex flex-col justify-center items-center space-y-5">
          <p>
            Click on <span className="underline">Create API Key</span>
          </p>
          <img
            src="/Screenshot 2024-06-09 142921.png"
            alt="api-key"
            className="md:h-80 md:w-[720px]"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default HowToGetAPIKey;
