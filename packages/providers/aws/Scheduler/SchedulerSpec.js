const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Scheduler";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { SchedulerSchedule } = require("./SchedulerSchedule");
const { SchedulerScheduleGroup } = require("./SchedulerScheduleGroup");

module.exports = pipe([
  () => [
    //
    SchedulerSchedule({ compare }),
    SchedulerScheduleGroup({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
