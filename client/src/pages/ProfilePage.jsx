import { useSelector } from 'react-redux';
import ProfileLayout from "../components/profile/ProfileLayout";
import { selectUser } from '../store/authSlice';

const ProfilePage = () => {
  const user = useSelector(selectUser);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <ProfileLayout user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
