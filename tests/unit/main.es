import Renderer from './spec/renderer.spec';
import CommandsAdapterSpec from './spec/commands_adapter.spec';
import NetworkAdapterSpec from './spec/network_adapter.spec';
import SpeechAdapterSpec from './spec/speech_adapter.spec';
import SpeakerSpec from './spec/speaker.spec';

NetworkAdapterSpec.test();
SpeakerSpec.test();
Renderer.test();
SpeechAdapterSpec.test();
CommandsAdapterSpec.test();
