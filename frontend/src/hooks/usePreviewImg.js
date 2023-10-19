import { useState } from "react"
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // check if the selected file is an image
        if (file && file.type.startsWith("image/")) {
            // create file reader
            const reader = new FileReader();

            reader.onloadend = () => {
                // update state
                setImgUrl(reader.result);
            }

            // turn the file into base64 string and get the string to render the image
            reader.readAsDataURL(file);
        } else {
            showToast("Invalid file type","Please select an image file.", "error");
            setImgUrl(null);
        }
    };

  return { handleImageChange, imgUrl, setImgUrl}
}
export default usePreviewImg