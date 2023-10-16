import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return <>
    <UserHeader />
    <UserPost likes={5} replies={6} postImg="/post1.jpg" postTitle="Title 1" />
    <UserPost likes={7} replies={0} postImg="/post2.jpg" postTitle="Title 2" />
    <UserPost likes={4} replies={1} postImg="/post3.jpg" postTitle="Title 3" />
    <UserPost likes={4} replies={1} postTitle="Title 3" />

  </>
}
export default UserPage