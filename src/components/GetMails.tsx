"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import MailItem from "./MailItem";
import Loader from "./Loader";
import SelectResult from "./SelectResult";
import { classifyMail } from "@/utils/categorizeMails";
import { Button } from "./ui/button";

function GetMails() {
  const [mail, setMail] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [classifyLoading, setClassifyLoading] = useState(false);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [readMailIds, setReadMailIds] = useState<string[]>([]);
  const [maxResults, setMaxResults] = useState(10);
  const [APIKEY, setAPIKEY] = useState("");

  useEffect(() => {
    setAPIKEY(localStorage.getItem("gemini_api_key")!);
    const getMailId = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/email?maxResults=${maxResults}`);
        const fetchedMails: Mail[] = response.data.data;

        setMail(fetchedMails);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getMailId();
  }, [maxResults, APIKEY]);

  const classifyMails = async () => {
    try {
      setClassifyLoading(true);
      const classifiedMails = await Promise.all(
        mail.map(async (mail) => {
          const classification = await classifyMail(mail, 3, APIKEY!);
          return { ...mail, category: classification };
        })
      );
      setMail(classifiedMails);
    } catch (error) {
      console.log(error);
    } finally {
      setClassifyLoading(false);
    }
  };

  const handleMailClick = (mail: Mail) => {
    setSelectedMail(mail);
    if (!readMailIds.includes(mail.id)) {
      setReadMailIds([...readMailIds, mail.id]);
    }
  };

  if (mail.length <= 0 || loading) {
    return <Loader />;
  }

  if (selectedMail) {
    return (
      <MailItem mail={selectedMail} onBack={() => setSelectedMail(null)} />
    );
  }

  const getSenderName = (fromHeader: string) => {
    const match = fromHeader.match(/(.*)<.*>/);
    return match ? match[1].trim() : fromHeader;
  };

  return (
    <div className="flex flex-col justify-between items-start my-5 mx-5 md:mx-16 lg:mx-24 space-y-5">
      <div className="flex justify-between items-center w-full">
        <SelectResult maxResult={maxResults} setMaxResult={setMaxResults} />
        <Button onClick={classifyMails}>Classify</Button>
      </div>
      <div className="">
        {mail.map((data, num) => (
          <div
            key={data.id}
            onClick={() => handleMailClick(data)}
            className={`cursor-pointer flex justify-start items-start space-x-2 md:space-x-5 border-b-2 p-2 text-[8px]  sm:text-xs md:text-base ${
              readMailIds.includes(data.id)
                ? "font-normal bg-slate-100"
                : "font-medium bg-white"
            }`}
          >
            <p className="w-10 hidden md:block">{num + 1}</p>
            <p className="w-1/4">
              {getSenderName(
                data.payload.headers.find((header) => header.name === "From")
                  ?.value || "Unknown Sender"
              )}
            </p>
            <p className="w-1/2">
              {
                data.payload.headers.find((header) => header.name === "Subject")
                  ?.value
              }
            </p>
            <p className="w-1/4 hidden md:block">
              {new Date(Number(data.internalDate)).toLocaleString() ||
                "Unknown Date"}
            </p>
            {classifyLoading ? (
              <Loader />
            ) : (
              <p className="w-1/4">{data.category || "Uncategorized"}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetMails;
