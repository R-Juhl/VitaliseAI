// src/hooks/useDynamicStyles.js
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const useDynamicStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    // General
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#1A2F38' : '#D3E0EA',
    },
    titleText: {
      color: theme === 'dark' ? '#FFF' : 'black',
      fontSize: 16,
    },

    // SettingsModal
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    modalContainer: {
      width: 300,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: theme === 'dark' ? '#1A2F38' : '#D3E0EA',
      alignItems: 'center',
    },
    modalTitle: {
      color: theme === 'dark' ? '#FFF' : 'black',
      fontSize: 25,
      marginBottom: 15,
    },
    modalSection: {
      width: '100%',
      marginBottom: 10,
    },
    modalSectionTitle: {
      color: theme === 'dark' ? '#FFF' : 'black',
      fontSize: 20,
      marginBottom: 5,
    },
    modalLabel: {
      color: theme === 'dark' ? '#FFF' : 'black',
      fontSize: 14,
      marginVertical: 5,
    },
    modalPickerSection: {
      backgroundColor: theme === 'dark' ? '#05445E' : '#A9C0D8',
      padding: 10,
      marginBottom: 5,
      borderRadius: 5,
    },
    modalPicker: {
      width: '100%',
      color: theme === 'dark' ? '#FFF' : '#1A2F38',
      inputIOS: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        backgroundColor: 'transparent',
      },
      inputAndroid: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        backgroundColor: 'transparent',
      },
    },
    modalSwitchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalSliderContainer: {
      width: '100%',
      alignItems: 'center',
    },
    modalSlider: {
      width: '100%',
      height: 40,
    },
    modalCurrentSpeed: {
      color: theme === 'dark' ? '#FFF' : '#1A2F38',
      textAlign: 'center',
      marginVertical: 5,
    },
    modalForgetMeButton: {
      backgroundColor: '#FF4136',
      padding: 10,
      borderRadius: 10,
      width: '50%',
      alignItems: 'center',
      marginVertical: 15,
    },
    modalSaveButton: {
      backgroundColor: '#189AB4',
      padding: 10,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    modalCancelButton: {
      backgroundColor: '#189AB4',
      padding: 10,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    modalButtonText: {
      color: '#FFF',
    },
    

    // Header

      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: theme === 'dark' ? '#05445E' : '#A9C0D8',
        paddingTop: 40,
        paddingBottom: 1,
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 90,
      },
      dropdownContainer: {
        width: 100,
      },


      // TopMenu

      topMenu: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
      },
      topMenuText: {
        color: theme === 'dark' ? '#FFF' : 'black',
        fontSize: 14,
        marginTop: 3,
      },


      //*** */ HomeScreen ***//
      homeTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: wp(5),
        fontWeight: 'bold',
        marginVertical: hp(1),
      },
      homePlanItem: {
        backgroundColor: theme === 'dark' ? '#05445E' : '#A9C0D8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: wp('90%'),
      },
      homePlanTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: 16,
        width: wp('75%'),
      },
      homePlanDate: {
        color: theme === 'dark' ? '#CCC' : '#696969',
        fontSize: 12,
      },
      homePlanButton: {
        padding: 10,
        borderRadius: 5,
      },



      //*** */ BotScreen ***//
      botContainer: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#1A2F38' : '#D3E0EA',
      },
      botWelcomeText: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        marginBottom: 15,
      },
      botSafeArea: {
        flex: 1,
        marginHorizontal: wp(5),
      },
      botMessageContainer: {
        flex: 1,
        marginTop: hp(1),
      },
      botMessageHistory: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#05445E' : '#A9C0D8',
        borderRadius: 20,
        paddingHorizontal: wp(4),
        marginTop: hp(1),
        marginBottom: hp(1),
      },
      botInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(1),
        marginBottom: hp(1),
      },
      botButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: hp(0),
      },
      botScrollView: {
        flexGrow: 1,
      },
      // Bot Icon Styles
      botIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
      },
      botIcon: {
        height: hp(10),
        width: hp(10),
      },
      botTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: wp(5),
        fontWeight: 'bold',
        marginTop: hp(1),
      },
      // Message Styles
      botSystemMessageContainer: {
        padding: wp(4),
        alignItems: 'center',
        justifyContent: 'center',
      },
      botUserContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: wp(1),
        marginVertical: 5,
      },
      botAssistantContainer: {
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: wp(1),
        marginVertical: 5,
      },
      botUserMessage: {
        maxWidth: '90%',
        alignSelf: 'flex-end',
        backgroundColor: '#F2856B',
        padding: 10,
        borderRadius: 10,
      },
      botAssistantMessage: {
        maxWidth: '90%',
        alignSelf: 'flex-start',
        backgroundColor: '#FFD8B5',
        padding: 10,
        borderRadius: 10,
      },
      botSystemMessageText: {
        color: '#FFF',
        fontSize: 16,
      },
      botMessage: {
        color: '#FFF',
        fontSize: 16,
      },
      botMessageUser: {
        color: '#FFF',
        fontSize: 16,
      },
      botMessageAssistant: {
        color: 'black',
        fontSize: 16,
      },
      botPlaceholderText: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: hp(2),
      },
      // Input and Button Styles
      botMessageInput: {
        flex: 1,
        backgroundColor: '#ECEFF1',
        borderRadius: 20,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        fontSize: wp(4),
        color: '#1A2F38',
      },
      botAttachButton: {
        marginLeft: wp(1),
        marginRight: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
      },
      imageAttachmentIcon: {
        marginLeft: wp(3),
        marginRight: wp(1),
        width: hp(15),
        height: hp(15),
        justifyContent: 'center',
        alignItems: 'center',
      },
      attachModal: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      attachModalTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: wp(5),
        fontWeight: 'bold',
        marginVertical: hp(1),
      },
      modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
      },
      cancelModalButton: {
        backgroundColor: '#189AB4',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        minHeight: 45,
      },
      attachModalButton: {
        backgroundColor: '#189AB4',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        minHeight: 45,
        flex: 1,
        marginHorizontal: 5,
      },
      botSendButton: {
        backgroundColor: '#05445E',
        borderRadius: 20,
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
      },
      botSendButtonText: {
        color: '#FFF',
        fontSize: wp(4),
      },
      botRecordButton: {
        marginHorizontal: wp(5),
      },
      botRecordIcon: {
        width: hp(10),
        height: hp(10),
      },
      botSideButton: {
        backgroundColor: '#05445E',
        borderRadius: 20,
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        flexDirection: 'row',
        width: wp(28),
        alignItems: 'center',
        justifyContent: 'center',
      },
      botSideButtonText: {
        color: '#FFF',
        fontSize: wp(4),
        textAlign: 'center',
      },


      dropupMenuContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: '#05445E',
        borderRadius: 20,
        width: wp(28),
      },
      dropupMenuItem: {
        color: '#FFF',
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        fontSize: wp(4),
        textAlign: 'center',
      },


      //*** ThreadsScreen ***//
      threadsContainer: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#1A2F38' : '#D3E0EA',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#1A2F38' : '#D3E0EA',
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      // Modal Styles
      modalView: {
        margin: 20,
        backgroundColor: theme === 'dark' ? '#05445E' : '#D3E0EA',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
      },
      modalInput: {
        borderColor: '#189AB4',
        backgroundColor: theme === 'dark' ? '#1A2F38' : '#A9C0D8',
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        borderRadius: 10,
        borderWidth: 1,
        width: '100%',
        padding: 10,
        marginBottom: 10,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
      threadsButton: {
        backgroundColor: '#189AB4',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        minHeight: 45,
        flex: 1,
        marginHorizontal: 5,
      },
      deleteButton: {
        backgroundColor: '#FF4136',
      },
      // Text and Title Styles
      threadsTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: wp(5),
        fontWeight: 'bold',
        marginVertical: hp(1),
      },
      textStyle: {
        color: '#FFF'
      },
      threadTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: 16,
        width: wp('75%'),
      },
      threadDate: {
        color: theme === 'dark' ? '#CCC' : '#696969',
        fontSize: 12,
      },
      // Thread Item Styles
      threadItem: {
        backgroundColor: theme === 'dark' ? '#05445E' : '#A9C0D8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: wp('90%'),
      },
      threadActions: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      },


      //*** ProfileScreen ***//
      profileContainer: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#1A2F38' : '#D3E0EA',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      profileScrollviewContainer: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#05445E' : '#A9C0D8',
        borderRadius: 20,
        padding: wp(4),
        marginTop: hp(1),
      },
      profileTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: wp(5),
        fontWeight: 'bold',
        marginVertical: hp(1),
      },
      profileWelcomeText: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        marginBottom: 15,
      },
      profileInputTitle: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        fontSize: 16,
        width: wp('75%'),
        marginVertical: 10,
      },
      profileInput: {
        borderColor: '#189AB4',
        backgroundColor: theme === 'dark' ? '#1A2F38' : '#A9C0D8',
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        borderRadius: 10,
        borderWidth: 1,
        width: '100%',
        padding: 10,
        marginBottom: 10,
      },
      profileInputPlaceholder: {
        color: '#C2C2C2',
      },
      profilePickerSection: {
        backgroundColor: theme === 'dark' ? '#189AB4' : '#A9C0D8',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
      },
      profilePicker: {
        width: '100%',
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        inputIOS: {
          color: theme === 'dark' ? '#FFF' : '#1A2F38',
          backgroundColor: 'transparent',
        },
        inputAndroid: {
          color: theme === 'dark' ? '#FFF' : '#1A2F38',
          backgroundColor: 'transparent',
        },
      },
      profileSlider: {
        width: '100%',
        height: 40,
      },
      profileFitnessLevel: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        textAlign: 'center',
        marginVertical: 10,
      },
      profileCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      profileCheckboxLabel: {
        marginLeft: 10,
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
      },
      goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
      },
      goalItemContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        width: '30%',
      },
      goalLabel: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        textAlign: 'center',
        marginBottom: 5,
      },
      goalIcon: {
        color: theme === 'dark' ? '#FFF' : '#1A2F38',
        marginBottom: 5,
      },
      goalSwitch: {
        marginTop: 5,
      },
      customGoalInputContainer: {
        alignItems: 'center',
        marginVertical: 10,
      },
      profileSaveButton: {
        backgroundColor: '#189AB4',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
      },
      profileSaveButtonText: {
        color: '#F4E9CD',
      },

  });

  return styles;
};
