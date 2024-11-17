import { trigger } from "react-native-haptic-feedback";

const FeedbackType = {
    ImpactLight: 'impactLight',
    ImpactMedium: 'impactMedium',
    ImpactHeavy: 'impactHeavy',

    Rigid: 'rigid',
    Soft: 'soft',

    NotificationSuccess: 'notificationSuccess',
    NotificationWarning: 'notificationWarning',
    NotificationError: 'notificationError',
}

class Pandora {
    static get FeedbackType() {
        return FeedbackType;
    }

    static TriggerFeedback(feedbackType = FeedbackType.ImpactMedium) {
        trigger(feedbackType);
    }
}

export default Pandora;