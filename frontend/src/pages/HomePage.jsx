import { Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"


const HomePage = () => {
  const [post, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);

  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);

      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        console.log(data);
        setPosts(data)
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    getFeedPosts();
  },[showToast, setPosts]);

  return (
    <>
      {!loading && post.length === 0 && (
        <h1>Feed from suggested users</h1>
      )}
      {loading && (
        <Flex justify={"center"}>
          <Spinner size="xl"/>
        </Flex>
      )}

      {post.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}
export default HomePage