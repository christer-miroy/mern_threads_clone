import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comment from "../components/Comment"

const PostPage = () => {
  const [liked, setLiked] = useState(false);

  return (
    <>
    <Flex>
      <Flex w={"full"} alignItems={"center"} gap={3}>
        <Avatar src="/user1.png" size={"md"} name="post1" />
        <Flex>
          <Text fontSize={"sm"}fontWeight={"bold"}>priscillasutla</Text>
          <Image src="/verified.png" w={4} h={4} ml={4} />
        </Flex>
      </Flex>

      <Flex gap={4} alignItems={"center"}>
        <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
        <BsThreeDots />
      </Flex>
    </Flex>

    <Text my={3}>Sample Post</Text>
    <Box
      borderRadius={6}
      overflow={"hidden"}
      border={"1px solid"}
      borderColor={"gray.light"}
    >
      <Image src={"/post1.jpg"} w={"full"} />
    </Box>

    <Flex gap={3} my={3}>
      <Actions liked={liked} setLiked={setLiked} />
    </Flex>

    <Flex gap={2} alignItems={"center"}>
      <Text color={"gray.light"} fontSize={"sm"}>238 replies</Text>
      <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
      <Text color={"gray.light"} fontSize={"sm"}>
        {10 + (liked ? 1 : 0)} likes
      </Text>
    </Flex>

    <Divider my={4} />

    <Flex justifyContent={"space-between"}>
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"2xl"}>👍</Text>
        <Text color={"gray.light"}>Get the app to like, reply.</Text>
      </Flex>
      <Button>Get</Button>
    </Flex>

    <Divider my={4} />

    <Comment
      comment="Sample comment 1"
      createdAt="2d"
      likes={10}
      username="johndoe"
      userAvatar="https://bit.ly/kent-c-dodds"
    />
    <Comment
      comment="Sample comment 2"
      createdAt="3d"
      likes={3}
      username="ninijacinto"
      userAvatar="https://bit.ly/ryan-florence"
    />
    <Comment
      comment="Sample comment 3"
      createdAt="1d"
      likes={7}
      username="rodelvelayo"
      userAvatar="https://bit.ly/prosper-baba"
    />
    </>
  )
}
export default PostPage