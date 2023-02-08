import { Button, Center, Flex, Heading, Text } from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import AnalysisResults from "../components/analysis/AnalysisResults";
import MessagesStore from "../components/analysis/MessagesStore";
import { initRecognizer } from "../scripts/azureAiHelpers";
import { mockMessages, mockWarnings } from "../scripts/mockData";
import { generateAnalyzeMessagesPrompt } from "../scripts/openAiHelper";
import { Warning } from "../scripts/types";

const speechKey = import.meta.env.VITE_SPEECH_KEY as string;
const speechRegion = import.meta.env.VITE_SPEECH_REGION as string;

export default function Home() {
  const [start, setStart] = createSignal(false);
  const [messages, setMessages] = createSignal<string[]>(mockMessages);
  const [isScam, setIsScam] = createSignal(true);
  const [warnings, setWarnings] = createSignal<Warning[]>(mockWarnings);
  const [showScamModal, setShowScamModal] = createSignal(true);

  const recognizer = initRecognizer(
    speechKey,
    speechRegion,
    (result: string) => {
      setMessages((messages) => [...messages, result]);
    }
  );

  const startRecording = () => {
    recognizer.startContinuousRecognitionAsync();
    setStart(true);
  };

  const stopRecording = () => {
    recognizer.stopContinuousRecognitionAsync();
    setStart(false);
  };

  const analyzeMessagesForScams = () => {
    let prompt = generateAnalyzeMessagesPrompt(messages());
    console.log("Analyzed messages");
    // axios
    //   .post(completionUrl, { prompt: JSON.stringify(prompt) })
    //   .then((res) => {
    //     console.log(res.data);
    //     let detection: Detection = res.data;
    //     setIsScam(detection.isScam);
    //     setWarnings(detection.suspiciousContent);
    //   })
    //   .catch(console.warn);
  };

  const saveCallInfo = () => {
    // axios
    //   .post(completionUrl, { prompt: JSON.stringify(prompt) })
    //   .then((res) => {
    //     console.log(res.data);
    //     let detection: Detection = res.data;
    //     setIsScam(detection.isScam);
    //     setWarnings(detection.suspiciousContent);
    //   })
    //   .catch(console.warn);
  };

  return (
    <>
      <Center mb="$6" flex={"auto"} flexDirection="column">
        <Heading size={"xl"}>Supercharge your calls</Heading>
        <Text size={"lg"}>Gain more insights</Text>
      </Center>

      <MessagesStore start={start()} messages={messages()} />

      <Flex my="$6" justifyContent="space-evenly">
        <Show
          when={start()}
          fallback={
            <Button size={"sm"} colorScheme="primary" onClick={startRecording}>
              Start Recording
            </Button>
          }
        >
          <Button size={"sm"} colorScheme="danger" onClick={stopRecording}>
            End Recording
          </Button>
        </Show>
        <Button
          size={"sm"}
          colorScheme="accent"
          onClick={analyzeMessagesForScams}
        >
          Analyze Messages
        </Button>
      </Flex>
      <AnalysisResults isScam={isScam()} warnings={warnings()} />
    </>
  );
}
