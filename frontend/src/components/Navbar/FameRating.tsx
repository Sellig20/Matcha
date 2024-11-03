import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/FameRating.css"
import { useProfile } from './User/profileContext';
import { useParams } from 'react-router';
import { UsersLikesCreate, UsersProfilesViewsCreate } from '../../../../backend/src/orm/schema';
import { useWebSocketContext } from '../../security/wsContext';

const FameRating = () => {

    //recuperer le nombre de vues en bdd : combien / qui / cliquer sur qui

    const [message, setMessage] = useState('');
    const profile = useProfile();
    const { idd } = useParams<{idd:string}>();
    const [views, setViews] = useState<UsersProfilesViewsCreate[]>([]);
    const [likes, setLikes] = useState<UsersLikesCreate[]>([]);
    const { socket } = useWebSocketContext();

    const getWhoViewedMe = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/views/${idd}`);
            setMessage(response.data.message);
            console.log("\n\n message FM is : ", message);
            setViews(response.data.numberViewed || []);
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who viewed me : ${error}`);
            console.log("\n\n message FM is : ", message);
        }
    };

    const getWhoLikedMe = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/likes/${idd}`);
            setMessage(response.data.message);
            console.log("\n\n message FM is : ", message);
            setLikes(response.data.numberLikes || []);
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who liked me : ${error}`);
            console.log("\n\n message FM is : ", message);
        }
    };

    useEffect(() => {
        getWhoViewedMe();
        getWhoLikedMe();
        if (socket) {
            socket.on('insert_view', (newView) => {
                setViews((prevViews) => [...prevViews, newView]);
            })

            socket.on('insert_likes', (newLike) => {
                setLikes((prevLikes) => [...prevLikes, newLike]);
            })
        };

        return () => {
            socket?.off('insert_view');
        };
        
    }, []);

  return (
    <section className="gradient-custom">
        <div>
            <h3>Structure avec une jauge et trois rectangles alignés horizontalement</h3>
        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center">
                {/* Grand carré */}
                <div className="biggy col-12 col-xl-80 d-flex justify-content-center">
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '100%', width: '100%' }}>
                        
                        {/* Jauge horizontale */}
                        <div className="progress mb-4" style={{ height: '30px' }}>
                           jauge
                        </div>

                        {/* Trois rectangles alignés horizontalement */}
                        <div className="fm-row row">
                            {/* Premier rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <h3 className="text-center">Rectangle 1 : VIEWS</h3>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <table className="table-fm">
                                            <thead>
                                                <tr>
                                                    {/* <th className="th-fm">INDEX</th> */}
                                                    <th className="th-fm">WHO ?</th>
                                                    <th className="th-fm">WHEN ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {views.map((view, index) => (
                                                    <tr key={index}>
                                                        {/* <td className="td-fm">{index + 1}</td> */}
                                                        <td className="td-fm">{view.user_viewer_id}</td>
                                                        <td className="td-fm">{new Date(view.view_started_on).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Deuxième rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                        <h3 className="text-center">Rectangle 2 : LIKES</h3>
                                        <div className="card-body d-flex align-items-center justify-content-center">
                                        <table className="table-fm">
                                            <thead>
                                                <tr>
                                                    <th className="th-fm">WHO ?</th>
                                                    <th className="th-fm">WHEN ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {likes.map((likes, index) => (
                                                    <tr key={index}>
                                                        <td className="td-fm">{likes.user_id}</td>
                                                        <td className="td-fm">{new Date(likes.liked_on).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Troisième rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 3 : MATCHS</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
);

};
  
  export default FameRating;