import { hapTasks } from '@ohos/hvigor-ohos-plugin';
import { locPlugin } from '@app/loc-plugin';

export default {
    system: hapTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins:[locPlugin()]         /* Custom plugin to extend the functionality of Hvigor. */
    // plugins:[]
}
