import { GetServerSideProps } from "next";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function Feed(props){

    const {user} = useContext(AuthContext);
    const [newPost, setNewPost] = useState('');
    const [posts, setPosts] = useState([]);
    //console.log(user);

    useEffect(() =>{

        supabase.from('posts')
        .select('*')
        .order('created_at', {ascending: true})
        .then((response) => setPosts(response.body))

        supabase
            .from('posts')
            .on('INSERT', response =>{
                setPosts(state => [...state, response.new])
            })
            .subscribe();

    },[])

    async function sendNewpost(event: FormEvent){
        event.preventDefault();
        if(!newPost.trim()){
            return;
        }
        const {error} = await supabase.from('posts').insert({
            content: newPost,
        })
        if(error){
            console.log(error);
            return;
        }
        setNewPost('');
    }
    
    
    return(
        <div>
            <h1>Feed</h1>
            <form onSubmit ={sendNewpost}>
                <textarea 
                placeholder ='write new post...'
                onChange = {e => setNewPost(e.target.value) }
                value ={newPost}
                />

                <button type ='submit'>
                    Send
                </button>

                <ul>
                    {posts.map(post => (
                        <li key={post.id}>{post.content}</li>
                    ))}
                  
                </ul>

            </form>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {user} = await supabase.auth.api.getUserByCookie(ctx.req)
    console.log(user)
    
    if(!user){
        return{
            redirect:{
                destination:'/',
                permanent: false
            }
        }
    }
    
    const response = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: true })

  return {
    props: {
      posts: response.body,
    }
  }
}