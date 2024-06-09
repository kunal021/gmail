interface Mail {
  id: string;
  threadId: string;
  internalDate: string;
  snippet: string;
  payload: {
    headers: { name: string; value: string }[];
    body?: { data: string };
    parts?: Array<{
      mimeType: string;
      filename?: string;
      body: { attachmentId?: string; size: number; data?: string };
      parts?: any;
    }>;
  };
  category?: string;
}

interface MailItemProps {
  mail: Mail;
  onBack: () => void;
}

interface SelectresultProps {
  maxResult: number;
  setMaxResult: React.Dispatch<React.SetStateAction<number>>;
}
