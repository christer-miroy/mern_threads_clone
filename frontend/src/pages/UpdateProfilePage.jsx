import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { useRef, useState } from 'react';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';


const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);
  const [input, setInput] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: '',
  });
  
  /* change profile photo */
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImg() //from hooks

  /* loading spinner */
  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updating) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-type" : "application/json",
        },
        body: JSON.stringify({ ...input, profilePic:imgUrl }),
      });

      // updated user object
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Profile updated successfully.", "success");
      setUser(data);

      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast('Error', error, 'error');
    } finally {
      setUpdating(false);
    }
  }

  /* cancel button */
  const handleCancel = async () => {
    navigate('/');
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        align={'center'}
        justify={'center'}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Update Profile
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>Change Profile Photo</Button>
                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              isLoading={updating}
              type='submit'
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  )
}
export default UpdateProfilePage