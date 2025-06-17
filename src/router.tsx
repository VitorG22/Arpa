import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginIndex from "./pages/login";
import RegisterIndex from "./pages/register";
import { Home } from "./pages/Home";
import NewPost from "./pages/newPost";
import Search from "./pages/search";
import BaseStructure from "./BaseStructure";
import EditProfile from "./pages/profile/editProfile";
import Explore from "./pages/posts";
import ProfileContainer from "./pages/profile";
import NotificationsPage from "./pages/notifications";
import { UserChatContainer, GroupChatContainer } from "./pages/messages/chat";
import ContactsPage from "./pages/messages";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <LoginIndex />
            },
            {
                path: '/register',
                element: <RegisterIndex />
            },
            {
                path: '/',
                element: <BaseStructure />,
                children: [
                    {
                        path: '/home',
                        element: <Home />
                    },
                    {
                        path: '/notifications',
                        element: <NotificationsPage />
                    },
                    {
                        path: '/contacts',
                        element: <ContactsPage />,
                    },
                    {
                        path: '/chat/:userId',
                        element: <UserChatContainer />
                    },
                    {
                        path: '/chat/group/:groupId',
                        element: <GroupChatContainer />
                    },
                    {
                        path: '/user',
                        children: [
                            {
                                path: ":profileId",
                                element: <ProfileContainer />
                            },
                            {
                                path: "editProfile",
                                element: <EditProfile />
                            }
                        ]
                    },
                    {
                        path: '/newPost',
                        element: <NewPost />,
                    },
                    {
                        path: '/search',
                        element: <Search />,
                    },
                    {
                        path: '/explore/:type/:postId',
                        element: <Explore />,
                    },
                    {
                        path: '/explore',
                        element: <Explore />,
                    },
                ]
            },
        ]
    }
])