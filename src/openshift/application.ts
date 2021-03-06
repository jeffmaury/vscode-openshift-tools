/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { OpenShiftItem } from './openshiftItem';
import { OpenShiftObject, Command } from '../odo';
import { window } from 'vscode';
import { Progress } from '../util/progress';

export class Application extends OpenShiftItem {

    static async describe(treeItem: OpenShiftObject): Promise<void> {
        const application = await Application.getOpenShiftCmdData(treeItem,
            "From which project you want to describe Application",
            "Select Application you want to describe");
        if (application) Application.odo.executeInTerminal(Command.describeApplication(application.getParent().getName(), application.getName()));
    }

    static async del(treeItem: OpenShiftObject): Promise<string> {
        const application = await Application.getOpenShiftCmdData(treeItem,
            "From which Project you want to delete Application",
            "Select Application to delete");
        if (application) {
            const appName = application.getName();
            const value = await window.showWarningMessage(`Do you want to delete Application '${appName}?'`, 'Yes', 'Cancel');
            if (value === 'Yes') {
                return Progress.execFunctionWithProgress(`Deleting the Application '${appName}'`, () => Application.odo.deleteApplication(application))
                    .then(() => `Application '${appName}' successfully deleted`)
                    .catch((err) => Promise.reject(`Failed to delete Application with error '${err}'`));
            }
        }
        return null;
    }
}