import AutoLaunch from "auto-launch";
import { ENVIRONMENT } from "shared/constants";
import
{
    displayName,
} from '~/package.json';

//alternative: https://github.com/Teamwork/node-auto-launch/issues/93#issuecomment-796702682
// works for windows (tested on sandbox) but opens the app in the foreground
export async function setupAutoLaunch()
{
    const cl = new AutoLaunch({
        name: displayName,
        isHidden: true
    });

    if (!ENVIRONMENT.IS_DEV)
    {
        if (!(await cl.isEnabled()))
            cl.enable();
    }
}