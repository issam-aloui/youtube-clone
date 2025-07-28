import WatchPage from "./pages/WatchPage";
import HomePage from "./pages/homePage";
export default function App() {
  return (
    <>
      <WatchPage
        videoUrl="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
        title="Example Video"
        channelName="Example Channel"
        subscriberCount={1000000}
        description="This is an example video description."
        likes={100}
        dislikes={5}
        views={1000}
        uploadDate="2023-01-01"
      />
    </>
  );
}
