import StoriesCarrousel from "../../../assets/storiesCarrousel";
import Text from "../../../components/texts";

export default function ProfileStories({profileId}:{profileId:string}){
    return(
        <main className='w-full '>
            <Text className='ml-4' size="small" variant="secondary" weight="bold">
                Stories
            </Text>
            <StoriesCarrousel/>
        </main>
    )
}