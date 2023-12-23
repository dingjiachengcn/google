#include "modules/audio_coding/codecs/pcm16b/audio_decoder_pcm16b.h"
# include "modules/rtp_rtcp/source/byte_io.h"
#include "test/fuzzers/audio_decoder_fuzzer.h"

namespace webrtc {
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
  if (size > 10000) {
    return 0;
  }

  static const size_t num_channels = 2; // GE 1
  static const int kSampleRateHz = 8000; // 8000, 16000, 32000, 48000

  AudioDecoderPcm16B dec(kSampleRateHz, num_channels);
  
  static const size_t kAllocatedOuputSizeSamples = kSampleRateHz / 10;
  int16_t output[kAllocatedOuputSizeSamples];
  FuzzAudioDecoder(DecoderFunctionType::kNormalDecode, data, size, &dec,
                   kSampleRateHz, sizeof(output), output);
  return 0;
}
}  // namespace webrtc
