// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "StreamingStack-MediaLiveMediaLiveAccessRoleB69B038-1IC1R8J1N5SC9",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "medialive.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "mediaconnect:AddFlowMediaStreams",
                  "mediaconnect:AddFlowOutputs",
                  "mediaconnect:AddFlowSources",
                  "mediaconnect:CreateFlow",
                  "mediaconnect:DeleteFlow",
                  "mediaconnect:ManagedAddOutput",
                  "mediaconnect:ManagedDescribeFlow",
                  "mediaconnect:ManagedRemoveOutput",
                ],
                Resource: `arn:aws:mediaconnect:${
                  config.region
                }:${config.accountId()}:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "medialivecustom",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSElementalMediaPackageFullAccess",
          PolicyArn:
            "arn:aws:iam::aws:policy/AWSElementalMediaPackageFullAccess",
        },
        {
          PolicyName: "CloudWatchLogsFullAccess",
          PolicyArn: "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
        },
      ],
    }),
  },
  {
    type: "Flow",
    group: "MediaConnect",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Description: "StreamingStack_FlowA",
      Name: "StreamingStack_FlowA",
      Source: {
        Description: "StreamingStack_FlowA",
        IngestPort: 1024,
        Name: "StreamingStack_FlowA",
        WhitelistCidr: "0.0.0.0/0",
        MaxBitrate: 80000000,
        MinLatency: 100,
        Protocol: "srt-listener",
      },
    }),
  },
  {
    type: "Flow",
    group: "MediaConnect",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Description: "StreamingStack_FlowB",
      Name: "StreamingStack_FlowB",
      Source: {
        Description: "StreamingStack_FlowB",
        IngestPort: 1024,
        Name: "StreamingStack_FlowB",
        WhitelistCidr: "0.0.0.0/0",
        MaxBitrate: 80000000,
        MinLatency: 100,
        Protocol: "srt-listener",
      },
    }),
  },
  {
    type: "Channel",
    group: "MediaLive",
    properties: ({ getId }) => ({
      ChannelClass: "SINGLE_PIPELINE",
      Destinations: [
        {
          Id: "media-destination",
          MediaPackageSettings: [
            {
              ChannelId: "myMediaPackageChannel",
            },
          ],
          Settings: [],
        },
      ],
      EncoderSettings: {
        AudioDescriptions: [
          {
            AudioTypeControl: "FOLLOW_INPUT",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                InputType: "NORMAL",
                Profile: "LC",
                RateControlMode: "CBR",
                RawFormat: "NONE",
                SampleRate: 48000,
                Spec: "MPEG4",
              },
            },
            LanguageCodeControl: "FOLLOW_INPUT",
            Name: "audio_j8tr8",
          },
          {
            AudioSelectorName: "default",
            AudioTypeControl: "FOLLOW_INPUT",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                InputType: "NORMAL",
                Profile: "LC",
                RateControlMode: "CBR",
                RawFormat: "NONE",
                SampleRate: 48000,
                Spec: "MPEG4",
              },
            },
            LanguageCodeControl: "FOLLOW_INPUT",
            Name: "audio_6ht2vm",
          },
          {
            AudioSelectorName: "default",
            AudioTypeControl: "FOLLOW_INPUT",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                InputType: "NORMAL",
                Profile: "LC",
                RateControlMode: "CBR",
                RawFormat: "NONE",
                SampleRate: 48000,
                Spec: "MPEG4",
              },
            },
            LanguageCodeControl: "FOLLOW_INPUT",
            Name: "audio_s90hue",
          },
          {
            AudioSelectorName: "default",
            AudioTypeControl: "FOLLOW_INPUT",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                InputType: "NORMAL",
                Profile: "LC",
                RateControlMode: "CBR",
                RawFormat: "NONE",
                SampleRate: 48000,
                Spec: "MPEG4",
              },
            },
            LanguageCodeControl: "FOLLOW_INPUT",
            Name: "audio_i3rm19",
          },
          {
            AudioSelectorName: "default",
            AudioTypeControl: "FOLLOW_INPUT",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                InputType: "NORMAL",
                Profile: "LC",
                RateControlMode: "CBR",
                RawFormat: "NONE",
                SampleRate: 48000,
                Spec: "MPEG4",
              },
            },
            LanguageCodeControl: "FOLLOW_INPUT",
            Name: "audio_ze3rtr",
          },
          {
            AudioSelectorName: "default",
            AudioTypeControl: "FOLLOW_INPUT",
            CodecSettings: {
              AacSettings: {
                Bitrate: 96000,
                CodingMode: "CODING_MODE_2_0",
                InputType: "NORMAL",
                Profile: "LC",
                RateControlMode: "CBR",
                RawFormat: "NONE",
                SampleRate: 48000,
                Spec: "MPEG4",
              },
            },
            LanguageCodeControl: "FOLLOW_INPUT",
            Name: "audio_5l3zhb",
          },
        ],
        AvailConfiguration: {
          AvailSettings: {
            Scte35SpliceInsert: {
              NoRegionalBlackoutFlag: "FOLLOW",
              WebDeliveryAllowedFlag: "FOLLOW",
            },
          },
        },
        CaptionDescriptions: [],
        OutputGroups: [
          {
            Name: "HLS HD",
            OutputGroupSettings: {
              MediaPackageGroupSettings: {
                Destination: {
                  DestinationRefId: "media-destination",
                },
              },
            },
            Outputs: [
              {
                AudioDescriptionNames: ["audio_j8tr8"],
                CaptionDescriptionNames: [],
                OutputName: "_512x288",
                OutputSettings: {
                  MediaPackageOutputSettings: {},
                },
                VideoDescriptionName: "_512x288",
              },
              {
                AudioDescriptionNames: ["audio_6ht2vm"],
                CaptionDescriptionNames: [],
                OutputName: "_640x360",
                OutputSettings: {
                  MediaPackageOutputSettings: {},
                },
                VideoDescriptionName: "_640x360",
              },
              {
                AudioDescriptionNames: ["audio_s90hue"],
                CaptionDescriptionNames: [],
                OutputName: "_764x432",
                OutputSettings: {
                  MediaPackageOutputSettings: {},
                },
                VideoDescriptionName: "_768x432",
              },
              {
                AudioDescriptionNames: ["audio_i3rm19"],
                CaptionDescriptionNames: [],
                OutputName: "_960x540",
                OutputSettings: {
                  MediaPackageOutputSettings: {},
                },
                VideoDescriptionName: "_960x540",
              },
              {
                AudioDescriptionNames: ["audio_ze3rtr"],
                CaptionDescriptionNames: [],
                OutputName: "_1280x720",
                OutputSettings: {
                  MediaPackageOutputSettings: {},
                },
                VideoDescriptionName: "_1280x720",
              },
              {
                AudioDescriptionNames: ["audio_5l3zhb"],
                CaptionDescriptionNames: [],
                OutputName: "_1920x1080",
                OutputSettings: {
                  MediaPackageOutputSettings: {},
                },
                VideoDescriptionName: "_1920x1080",
              },
            ],
          },
        ],
        TimecodeConfig: {
          Source: "EMBEDDED",
        },
        VideoDescriptions: [
          {
            CodecSettings: {
              H264Settings: {
                AdaptiveQuantization: "HIGH",
                AfdSignaling: "NONE",
                Bitrate: 400000,
                BufFillPct: 90,
                BufSize: 800000,
                ColorMetadata: "INSERT",
                EntropyEncoding: "CAVLC",
                FlickerAq: "ENABLED",
                FramerateControl: "SPECIFIED",
                FramerateDenominator: 1,
                FramerateNumerator: 15,
                GopBReference: "ENABLED",
                GopClosedCadence: 1,
                GopNumBFrames: 3,
                GopSize: 2,
                GopSizeUnits: "SECONDS",
                Level: "H264_LEVEL_AUTO",
                LookAheadRateControl: "HIGH",
                MaxBitrate: 400000,
                NumRefFrames: 5,
                ParControl: "SPECIFIED",
                ParDenominator: 1,
                ParNumerator: 1,
                Profile: "MAIN",
                QvbrQualityLevel: 6,
                RateControlMode: "QVBR",
                ScanType: "PROGRESSIVE",
                SceneChangeDetect: "ENABLED",
                SpatialAq: "ENABLED",
                SubgopLength: "DYNAMIC",
                Syntax: "DEFAULT",
                TemporalAq: "ENABLED",
                TimecodeInsertion: "DISABLED",
              },
            },
            Height: 288,
            Name: "_512x288",
            RespondToAfd: "NONE",
            ScalingBehavior: "DEFAULT",
            Sharpness: 100,
            Width: 512,
          },
          {
            CodecSettings: {
              H264Settings: {
                AdaptiveQuantization: "HIGH",
                AfdSignaling: "NONE",
                Bitrate: 800000,
                BufFillPct: 90,
                BufSize: 1600000,
                ColorMetadata: "INSERT",
                EntropyEncoding: "CAVLC",
                FlickerAq: "ENABLED",
                FramerateControl: "SPECIFIED",
                FramerateDenominator: 1,
                FramerateNumerator: 30,
                GopBReference: "ENABLED",
                GopClosedCadence: 1,
                GopNumBFrames: 3,
                GopSize: 2,
                GopSizeUnits: "SECONDS",
                Level: "H264_LEVEL_AUTO",
                LookAheadRateControl: "HIGH",
                MaxBitrate: 800000,
                NumRefFrames: 5,
                ParControl: "SPECIFIED",
                ParDenominator: 1,
                ParNumerator: 1,
                Profile: "MAIN",
                QvbrQualityLevel: 7,
                RateControlMode: "QVBR",
                ScanType: "PROGRESSIVE",
                SceneChangeDetect: "ENABLED",
                SpatialAq: "ENABLED",
                SubgopLength: "DYNAMIC",
                Syntax: "DEFAULT",
                TemporalAq: "ENABLED",
                TimecodeInsertion: "DISABLED",
              },
            },
            Height: 360,
            Name: "_640x360",
            RespondToAfd: "NONE",
            ScalingBehavior: "DEFAULT",
            Sharpness: 100,
            Width: 640,
          },
          {
            CodecSettings: {
              H264Settings: {
                AdaptiveQuantization: "HIGH",
                AfdSignaling: "NONE",
                Bitrate: 1200000,
                BufFillPct: 90,
                BufSize: 2400000,
                ColorMetadata: "INSERT",
                EntropyEncoding: "CAVLC",
                FlickerAq: "ENABLED",
                FramerateControl: "SPECIFIED",
                FramerateDenominator: 1,
                FramerateNumerator: 30,
                GopBReference: "ENABLED",
                GopClosedCadence: 1,
                GopNumBFrames: 3,
                GopSize: 2,
                GopSizeUnits: "SECONDS",
                Level: "H264_LEVEL_AUTO",
                LookAheadRateControl: "HIGH",
                MaxBitrate: 1200000,
                NumRefFrames: 5,
                ParControl: "SPECIFIED",
                ParDenominator: 1,
                ParNumerator: 1,
                Profile: "MAIN",
                QvbrQualityLevel: 7,
                RateControlMode: "QVBR",
                ScanType: "PROGRESSIVE",
                SceneChangeDetect: "ENABLED",
                SpatialAq: "ENABLED",
                SubgopLength: "DYNAMIC",
                Syntax: "DEFAULT",
                TemporalAq: "ENABLED",
                TimecodeInsertion: "DISABLED",
              },
            },
            Height: 432,
            Name: "_768x432",
            RespondToAfd: "NONE",
            ScalingBehavior: "DEFAULT",
            Sharpness: 100,
            Width: 768,
          },
          {
            CodecSettings: {
              H264Settings: {
                AdaptiveQuantization: "HIGH",
                AfdSignaling: "NONE",
                Bitrate: 1800000,
                BufFillPct: 90,
                BufSize: 3600000,
                ColorMetadata: "INSERT",
                EntropyEncoding: "CAVLC",
                FlickerAq: "ENABLED",
                FramerateControl: "SPECIFIED",
                FramerateDenominator: 1,
                FramerateNumerator: 30,
                GopBReference: "ENABLED",
                GopClosedCadence: 1,
                GopNumBFrames: 3,
                GopSize: 2,
                GopSizeUnits: "SECONDS",
                Level: "H264_LEVEL_AUTO",
                LookAheadRateControl: "HIGH",
                MaxBitrate: 1800000,
                NumRefFrames: 5,
                ParControl: "SPECIFIED",
                ParDenominator: 1,
                ParNumerator: 1,
                Profile: "MAIN",
                QvbrQualityLevel: 7,
                RateControlMode: "QVBR",
                ScanType: "PROGRESSIVE",
                SceneChangeDetect: "ENABLED",
                SpatialAq: "ENABLED",
                SubgopLength: "DYNAMIC",
                Syntax: "DEFAULT",
                TemporalAq: "ENABLED",
                TimecodeInsertion: "DISABLED",
              },
            },
            Height: 540,
            Name: "_960x540",
            RespondToAfd: "NONE",
            ScalingBehavior: "DEFAULT",
            Sharpness: 100,
            Width: 960,
          },
          {
            CodecSettings: {
              H264Settings: {
                AdaptiveQuantization: "HIGH",
                AfdSignaling: "NONE",
                Bitrate: 2700000,
                BufFillPct: 90,
                BufSize: 5400000,
                ColorMetadata: "INSERT",
                EntropyEncoding: "CAVLC",
                FlickerAq: "ENABLED",
                FramerateControl: "SPECIFIED",
                FramerateDenominator: 1,
                FramerateNumerator: 30,
                GopBReference: "ENABLED",
                GopClosedCadence: 1,
                GopNumBFrames: 3,
                GopSize: 2,
                GopSizeUnits: "SECONDS",
                Level: "H264_LEVEL_AUTO",
                LookAheadRateControl: "HIGH",
                MaxBitrate: 2700000,
                NumRefFrames: 5,
                ParControl: "SPECIFIED",
                ParDenominator: 1,
                ParNumerator: 1,
                Profile: "MAIN",
                QvbrQualityLevel: 8,
                RateControlMode: "QVBR",
                ScanType: "PROGRESSIVE",
                SceneChangeDetect: "ENABLED",
                SpatialAq: "ENABLED",
                SubgopLength: "DYNAMIC",
                Syntax: "DEFAULT",
                TemporalAq: "ENABLED",
                TimecodeInsertion: "DISABLED",
              },
            },
            Height: 720,
            Name: "_1280x720",
            RespondToAfd: "NONE",
            ScalingBehavior: "DEFAULT",
            Sharpness: 100,
            Width: 1280,
          },
          {
            CodecSettings: {
              H264Settings: {
                AdaptiveQuantization: "HIGH",
                AfdSignaling: "NONE",
                Bitrate: 4100000,
                BufFillPct: 90,
                BufSize: 8200000,
                ColorMetadata: "INSERT",
                EntropyEncoding: "CAVLC",
                FlickerAq: "ENABLED",
                FramerateControl: "SPECIFIED",
                FramerateDenominator: 1,
                FramerateNumerator: 30,
                GopBReference: "ENABLED",
                GopClosedCadence: 1,
                GopNumBFrames: 3,
                GopSize: 2,
                GopSizeUnits: "SECONDS",
                Level: "H264_LEVEL_AUTO",
                LookAheadRateControl: "HIGH",
                MaxBitrate: 4100000,
                NumRefFrames: 5,
                ParControl: "SPECIFIED",
                ParDenominator: 1,
                ParNumerator: 1,
                Profile: "HIGH",
                QvbrQualityLevel: 8,
                RateControlMode: "QVBR",
                ScanType: "PROGRESSIVE",
                SceneChangeDetect: "ENABLED",
                SpatialAq: "ENABLED",
                SubgopLength: "DYNAMIC",
                Syntax: "DEFAULT",
                TemporalAq: "ENABLED",
                TimecodeInsertion: "DISABLED",
              },
            },
            Height: 1080,
            Name: "_1920x1080",
            RespondToAfd: "NONE",
            ScalingBehavior: "DEFAULT",
            Sharpness: 100,
            Width: 1920,
          },
        ],
      },
      InputAttachments: [
        {
          InputAttachmentName: "media-package-input",
          InputId: `${getId({
            type: "Input",
            group: "MediaLive",
            name: "StreamingStack_MyInput",
          })}`,
        },
      ],
      InputSpecification: {
        Codec: "AVC",
        MaximumBitrate: "MAX_20_MBPS",
        Resolution: "HD",
      },
      Maintenance: {
        MaintenanceDay: "MONDAY",
        MaintenanceStartTime: "07:00",
      },
      Name: "MyMediaLiveChannel",
    }),
    dependencies: ({}) => ({
      iamRole:
        "StreamingStack-MediaLiveMediaLiveAccessRoleB69B038-1IC1R8J1N5SC9",
      inputs: ["StreamingStack_MyInput"],
    }),
  },
  {
    type: "Input",
    group: "MediaLive",
    properties: ({ getId }) => ({
      InputClass: "STANDARD",
      InputSourceType: "STATIC",
      MediaConnectFlows: [
        {
          FlowArn: `${getId({
            type: "Flow",
            group: "MediaConnect",
            name: "StreamingStack_FlowA",
          })}`,
        },
        {
          FlowArn: `${getId({
            type: "Flow",
            group: "MediaConnect",
            name: "StreamingStack_FlowB",
          })}`,
        },
      ],
      Name: "StreamingStack_MyInput",
      Type: "MEDIACONNECT",
    }),
    dependencies: ({}) => ({
      iamRole:
        "StreamingStack-MediaLiveMediaLiveAccessRoleB69B038-1IC1R8J1N5SC9",
      mediaConnectFlows: ["StreamingStack_FlowA", "StreamingStack_FlowB"],
    }),
  },
  {
    type: "Channel",
    group: "MediaPackage",
    properties: ({}) => ({
      Description: "Channel for StreamingStack",
      Id: "myMediaPackageChannel",
    }),
  },
];
