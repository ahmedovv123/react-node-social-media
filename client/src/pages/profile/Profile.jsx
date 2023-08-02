import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "components/posts/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "axios.js";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "context/authContext";
import Update from "components/update/Update";

const Profile = () => {
  const { id } = useParams();
  const [openUpdate, setOpenUpdate] = useState(false);

  const { isLoading, error, data } = useQuery(["user", id], () =>
    makeRequest.get("/users/find/" + id).then((res) => {
      return res.data;
    })
  );

  const { data: relationshipData } = useQuery(["relationships", id], () =>
    makeRequest.get("/relationships?followedUserId=" + id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (!following)
        return makeRequest.post("/relationships", { followedUserId: id });
      return makeRequest.delete("/relationships?followedUserId=" + id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationships", id]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  console.log(relationshipData);

  const { currentUser } = useContext(AuthContext);

  if (isLoading) return "Loading...";

  return (
    <div className="profile">
      <div className="images">
        <img src={"/upload/" + data.coverPic} alt="" className="cover" />
        <img src={"/upload/" + data.profilePic} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {+id === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData?.includes(currentUser.id)
                  ? "following"
                  : "follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={id} />
      </div>
      {openUpdate && <Update user={data} setOpenUpdate={setOpenUpdate} />}
    </div>
  );
};

export default Profile;
