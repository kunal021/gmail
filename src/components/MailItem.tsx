import { Button } from "./ui/button";

const MailItem: React.FC<MailItemProps> = ({ mail, onBack }) => {
  const subjectHeader = mail.payload.headers.find(
    (header) => header.name === "Subject"
  );
  const fromHeader = mail.payload.headers.find(
    (header) => header.name === "From"
  );
  const dateHeader = mail.payload.headers.find(
    (header) => header.name === "Date"
  );

  const decodeBase64 = (str: string) => {
    try {
      return decodeURIComponent(
        escape(window.atob(str.replace(/-/g, "+").replace(/_/g, "/")))
      );
    } catch (e) {
      return window.atob(str.replace(/-/g, "+").replace(/_/g, "/"));
    }
  };

  const renderParts = (parts: any) => {
    return parts.map((part: any, index: number) => {
      if (part.mimeType.startsWith("image/")) {
        const imageData = part.body?.data ? decodeBase64(part.body.data) : "";
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={`data:${part.mimeType};base64,${imageData}`}
            alt={part.filename || "Image"}
          />
        );
      } else if (part.mimeType === "text/html" && part.body?.data) {
        const htmlData = decodeBase64(part.body.data);
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: htmlData }} />
        );
      } else if (part.parts) {
        return renderParts(part.parts);
      }
      return null;
    });
  };
  return (
    <div className="flex flex-col justify-center items-center my-10 mx-8 md:mx-24 lg:mx-48 space-y-5">
      <div className="flex justify-between items-center w-full">
        <Button onClick={onBack}>Back</Button>
        <p className="rounded-full border-2 px-4 py-1 border-gray-500">
          {mail.category || "Uncategorized"}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center w-full space-y-5">
        <p className="text-lg md:text-2xl">
          {subjectHeader?.value || "No Subject"}
        </p>
        <div className="flex justify-between items-center w-full text-xs md:text-base">
          <p>
            <strong>From:</strong> {fromHeader?.value || "Unknown Sender"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(Number(mail.internalDate)).toLocaleString() ||
              "Unknown Date"}
          </p>
        </div>
      </div>
      <p className="flex justify-center items-start w-full text-xs md:text-base">
        {mail.snippet}
      </p>
      {mail.payload.body?.data && (
        <div
          dangerouslySetInnerHTML={{
            __html: decodeBase64(mail.payload.body.data),
          }}
          className="flex flex-col justify-center items-center w-full text-xs md:text-base"
        />
      )}
      {mail.payload.parts && renderParts(mail.payload.parts)}
    </div>
  );
};

export default MailItem;
