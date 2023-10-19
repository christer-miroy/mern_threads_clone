import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react"

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  if (!user && !loading) {
    return <h1>User not found.</h1>
  }

  return <>
  {/* UserHeader prop from UserHeader.jsx */}
    <UserHeader user={user} />
    <UserPost likes={5} replies={6} postImg="/post1.jpg" postTitle="Title 1" />
    <UserPost likes={7} replies={0} postImg="/post2.jpg" postTitle="Title 2" />
    <UserPost likes={4} replies={1} postImg="/post3.jpg" postTitle="Title 3" />
    <UserPost likes={4} replies={1} postTitle="Title 3" />

  </>
}
export default UserPage