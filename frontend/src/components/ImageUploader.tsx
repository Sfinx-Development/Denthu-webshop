import React, { useState } from "react";

interface ImageUploaderProps {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}
export default function ImageUploader(props: ImageUploaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        props.setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ padding: 2 }}
      />
      {props.imageUrl && (
        <img
          src={props.imageUrl}
          alt="Uploaded Preview"
          style={{ marginTop: "20px", maxHeight: "200px" }}
        />
      )}
    </div>
  );
}
