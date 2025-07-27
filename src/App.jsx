import WatchPage from "./pages/WatchPage";
export default function App() {
  return (
    <>
      <WatchPage
        videoUrl="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
        description="I told my viewers to invite me to their base. I rated them and the best one got all my money. However, some viewers didn't actually have a good build/farm and their goal was to kill me, so enjoy!

i am live every day here: 🟣 / ohnepixel ...more content here to test the expand functionality with a longer description that will definitely trigger the show more button when the text exceeds the initial height limit."
        views={253000}
        uploadDate="2025-01-20T10:30:00Z"
        likes={7300}
        dislikes={80}
      />
    </>
  );
}
