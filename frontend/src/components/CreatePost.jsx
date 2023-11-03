import { AddIcon } from "@chakra-ui/icons"
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 160;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const [remainingCharacters, setRemainingCharacters] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const {username} = useParams();

    /* photo */
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg() //from hooks
    const imageRef = useRef(null);

    // limit the number of characters in the post
    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingCharacters(0);
        } else {
            setPostText(inputText);
            setRemainingCharacters(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async() => {
        setLoading(true);
        try {
            const res = await fetch("api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    postedBy: user._id,
                    text: postText,
                    img: imgUrl
                })
            });
    
            const data = await res.json()
            if (data.error) {
                showToast("Error",data.error,"error");
                return
            }
    
            showToast("Success", "Post Created Successfully", "success");

            // if looking from own profile
            if (username === user.username) {
                setPosts([data, ...posts]);
            }

            onClose();

            // clear text field and image field
            setPostText("");
            setImgUrl("");
        } catch (error) {
            showToast("Error", error,"error");
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
        <Button
            position={"fixed"}
            bottom={10}
            right={5}
            bg={useColorModeValue("gray.300","gray.dark")}
            onClick={onOpen}
            size={{base:"sm", sm: "md"}}
        >
            <AddIcon />
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <Textarea
                            placeholder="Post your thoughts here..."
                            onChange={handleTextChange}
                            value={postText}
                        />
                        {/* number of characters left */}
                        <Text
                            fontSize="xs"
                            fontWeight="bold"
                            textAlign={"right"}
                            m={"1"}
                            color={"gray.600"}
                        >
                            {remainingCharacters}/{MAX_CHAR}
                        </Text>

                        <Input
                            type="file"
                            hidden
                            ref={imageRef}
                            onChange={handleImageChange}
                        />

                        <BsFillImageFill
                            style={{marginLeft:"5px", cursor:"pointer"}}
                            size={16}
                            onClick={() => imageRef.current.click()}
                        />
                    </FormControl>

                    {imgUrl && (
                        <Flex
                            mt={5}
                            w={"full"}
                            position={"relative"}
                        >
                            <Image
                                src={imgUrl}
                                alt="Selected Image"
                            />
                            <CloseButton
                                onClick={()=> {
                                    setImgUrl("")
                                }}
                                bg={"gray.600"}
                                position={"absolute"}
                                top={2}
                                right={2}
                            />
                        </Flex>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='blue'
                        mr={3}
                        onClick={handleCreatePost}
                        isLoading={loading}
                    >
                        Post
                    </Button>
                </ModalFooter>
            </ModalContent>
      </Modal>
    </>
  )
}
export default CreatePost