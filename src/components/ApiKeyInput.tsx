"use client";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

function ApiKeyInput() {
  const [value, setvalue] = useState("");

  useEffect(() => {
    localStorage.setItem("gemini_api_key", value);
  }, [value]);

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setvalue(e.target.value)}
        placeholder="Enter Gemini API"
        className="border-gray-500 border-2 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-black"
      />
    </div>
  );
}

export default ApiKeyInput;
