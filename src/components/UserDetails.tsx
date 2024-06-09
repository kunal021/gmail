import { auth } from "@/auth";
import Image from "next/image";
import { SignOut } from "./SignOut";

async function UserDetails() {
  const session = await auth();
  const userDetails = session?.user;

  if (!userDetails) {
    return (
      <p className="fixed inset-0 flex justify-center items-center text-xl text-gray-700">
        No User Found
      </p>
    );
  }

  return (
    <div className="flex justify-center items-center sticky top-0 w-full border-b-2 border-gray-200 bg-white shadow-sm z-50">
      <div className="flex items-center justify-between w-full mx-2 md:mx-5 my-2">
        <div className="flex justify-center items-center space-x-3 md:space-x-5">
          {userDetails.image && (
            <Image
              src={userDetails.image}
              alt="user"
              height={45}
              width={45}
              className="rounded-full border-2 border-gray-300"
            />
          )}
          <div className="flex flex-col space-y-0 justify-center items-start pb-1">
            <p className="text-sm md:text-lg font-semibold text-gray-800">
              {userDetails.name}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {userDetails.email}
            </p>
          </div>
        </div>
        <SignOut />
      </div>
    </div>
  );
}

export default UserDetails;
