import { Host, Service, Vulnerability, Credential, ActiveSession, Task } from './types';

export const initialHosts: Host[] = [
  { id: 'h1', ip: '192.168.1.10', name: 'ubuntu-web-prod', mac: '00:15:5d:01:23:45', os: 'Linux', status: 'Discovered', discoveredAt: '2026-06-24 00:05' },
  { id: 'h2', ip: '192.168.1.25', name: 'win-dc-2003', mac: '00:15:5d:01:23:46', os: 'Windows', status: 'Shelled', discoveredAt: '2026-06-24 00:10' },
  { id: 'h3', ip: '192.168.1.42', name: 'embedded-router', mac: '00:15:5d:01:23:47', os: 'embedded', status: 'Discovered', discoveredAt: '2026-06-24 00:15' },
  { id: 'h4', ip: '192.168.1.51', name: 'scada-plc', mac: '00:15:5d:01:23:48', os: 'RTOS', status: 'Looted', discoveredAt: '2026-06-24 00:20' },
  { id: 'h5', ip: '192.168.1.99', name: 'unknown-client', mac: '00:15:5d:01:23:49', os: 'Unknown', status: 'Discovered', discoveredAt: '2026-06-24 00:30' },
  { id: 'h6', ip: '10.0.0.12', name: 'nas-storage', mac: '00:15:5d:01:24:10', os: 'Linux', status: 'Cracked', discoveredAt: '2026-06-24 00:35' },
  { id: 'h7', ip: '10.0.0.15', name: 'win-iis-legacy', mac: '00:15:5d:01:24:11', os: 'Windows', status: 'Shelled', discoveredAt: '2026-06-24 00:40' },
  { id: 'h8', ip: '10.0.0.22', name: 'printer-hp', mac: '00:15:5d:01:24:12', os: 'embedded', status: 'Discovered', discoveredAt: '2026-06-24 00:45' },
];

export const initialServices: Service[] = [
  { id: 's1', hostId: 'h1', hostIp: '192.168.1.10', port: 22, protocol: 'tcp', name: 'SSH', banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.1', status: 'active' },
  { id: 's2', hostId: 'h1', hostIp: '192.168.1.10', port: 443, protocol: 'tcp', name: 'HTTPS', banner: 'nginx/1.18.0', status: 'active' },
  { id: 's3', hostId: 'h2', hostIp: '192.168.1.25', port: 3389, protocol: 'tcp', name: 'MS-WBT-SERVER', banner: 'RDP-enabled legacy', status: 'exploited' },
  { id: 's4', hostId: 'h2', hostIp: '192.168.1.25', port: 445, protocol: 'tcp', name: 'SMB', banner: 'Windows Server 2003 SMB v1', status: 'exploited' },
  { id: 's5', hostId: 'h3', hostIp: '192.168.1.42', port: 80, protocol: 'tcp', name: 'HTTP', banner: 'BusyBox httpd', status: 'active' },
  { id: 's6', hostId: 'h4', hostIp: '192.168.1.51', port: 502, protocol: 'tcp', name: 'Modbus', banner: 'Schneider Electric PLC Modbus TCP', status: 'exploited' },
  { id: 's7', hostId: 'h6', hostIp: '10.0.0.12', port: 22, protocol: 'tcp', name: 'SSH', banner: 'SSH-2.0-OpenSSH_7.4', status: 'exploited' },
  { id: 's8', hostId: 'h7', hostIp: '10.0.0.15', port: 5985, protocol: 'tcp', name: 'WINRM', banner: 'Microsoft WinRM', status: 'exploited' },
  { id: 's9', hostId: 'h7', hostIp: '10.0.0.15', port: 110, protocol: 'tcp', name: 'POP', banner: 'Microsoft Exchange POP3 service', status: 'active' },
];

export const initialVulnerabilities: Vulnerability[] = [
  {
    id: 'v1',
    hostId: 'h2',
    hostIp: '192.168.1.25',
    cve: 'CVE-2008-4250',
    title: 'MS08-067 Microsoft Server Service Relative Path Stack Corruption',
    severity: 'Critical',
    description: 'This module exploits a parsing flaw in the path canonicalization code of NetAPI32.dll through the Server Service.',
    applicableModule: 'exploit/windows/smb/ms08_067_netapi',
    exploited: true,
  },
  {
    id: 'v2',
    hostId: 'h1',
    hostIp: '192.168.1.10',
    cve: 'CVE-2021-3156',
    title: 'Sudo Baron Samedit Local Privilege Escalation',
    severity: 'High',
    description: 'A heap-based buffer overflow was found in sudo in the way it parses command line arguments.',
    applicableModule: 'exploit/linux/local/sudo_baron_samedit',
    exploited: false,
  },
  {
    id: 'v3',
    hostId: 'h7',
    hostIp: '10.0.0.15',
    cve: 'CVE-2017-0144',
    title: 'MS17-010 EternalBlue SMB Remote Code Execution',
    severity: 'Critical',
    description: 'This module exploits a vulnerability in the SMBv1 protocol in Windows operating systems.',
    applicableModule: 'exploit/windows/smb/ms17_010_eternalblue',
    exploited: true,
  },
  {
    id: 'v4',
    hostId: 'h4',
    hostIp: '192.168.1.51',
    cve: 'CVE-2018-1149',
    title: 'Modbus Command Injection / SCADA Unauthorized Read/Write',
    severity: 'High',
    description: 'Remote attackers can read/write device coils and registers without authentication.',
    applicableModule: 'exploit/scada/modbus_readwrite',
    exploited: true,
  },
  {
    id: 'v5',
    hostId: 'h3',
    hostIp: '192.168.1.42',
    cve: 'CVE-2022-27255',
    title: 'Realtek SDK router remote code execution',
    severity: 'Critical',
    description: 'Stack-based buffer overflow allows remote attackers to execute arbitrary code via a crafted UDP packet.',
    applicableModule: 'exploit/embedded/realtek_rce',
    exploited: false,
  },
];

export const initialCredentials: Credential[] = [
  { id: 'c1', hostIp: '10.0.0.12', service: 'SSH', username: 'root', privateType: 'Password', privateValue: 'alpine123', cracked: true, capturedAt: '2026-06-24 00:36' },
  { id: 'c2', hostIp: '192.168.1.25', service: 'SMB', username: 'Administrator', privateType: 'NTLM Hash', privateValue: 'e19ccf75ee54e0c4f74def904121a4f4', cracked: true, capturedAt: '2026-06-24 00:11' },
  { id: 'c3', hostIp: '10.0.0.15', service: 'WINRM', username: 'winadmin', privateType: 'Password', privateValue: 'P@ssw0rd12!', cracked: true, capturedAt: '2026-06-24 00:41' },
  { id: 'c4', hostIp: '192.168.1.51', service: 'Modbus', username: 'operator', privateType: 'Password', privateValue: 'default', cracked: false, capturedAt: '2026-06-24 00:21' },
  { id: 'c5', hostIp: '192.168.1.10', service: 'SSH', username: 'webuser', privateType: 'SSH Key', privateValue: '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAAC...', cracked: true, capturedAt: '2026-06-24 00:06' },
];

export const initialSessions: ActiveSession[] = [
  { id: 1, hostIp: '192.168.1.25', type: 'meterpreter', platform: 'windows/x86', port: 4444, openedAt: '2026-06-24 00:12', status: 'active' },
  { id: 2, hostIp: '10.0.0.15', type: 'meterpreter', platform: 'windows/x64', port: 4445, openedAt: '2026-06-24 00:42', status: 'active' },
  { id: 3, hostIp: '10.0.0.12', type: 'shell', platform: 'linux/x64', port: 5555, openedAt: '2026-06-24 00:37', status: 'active' },
];

export const metasploitModules = [
  { name: 'exploit/windows/smb/ms08_067_netapi', type: 'exploit', platform: 'Windows', description: 'Microsoft Server Service Relative Path Stack Corruption' },
  { name: 'exploit/windows/smb/ms17_010_eternalblue', type: 'exploit', platform: 'Windows', description: 'MS17-010 EternalBlue SMB Remote Code Execution' },
  { name: 'exploit/linux/ssh/ssh_login', type: 'auxiliary', platform: 'Linux', description: 'SSH Login Utility' },
  { name: 'exploit/linux/local/sudo_baron_samedit', type: 'exploit', platform: 'Linux', description: 'Sudo Baron Samedit Local Privilege Escalation' },
  { name: 'exploit/scada/modbus_readwrite', type: 'exploit', platform: 'RTOS', description: 'Modbus Command Injection' },
  { name: 'exploit/embedded/realtek_rce', type: 'exploit', platform: 'embedded', description: 'Realtek SDK router remote code execution' },
  { name: 'auxiliary/scanner/portscan/tcp', type: 'auxiliary', platform: 'All', description: 'TCP Port Scanner' },
  { name: 'auxiliary/scanner/http/dir_scanner', type: 'auxiliary', platform: 'All', description: 'HTTP Directory Scanner' },
  { name: 'post/windows/gather/credentials', type: 'post', platform: 'Windows', description: 'Gather Credentials/Hashes from Registry' },
  { name: 'post/linux/gather/hashdump', type: 'post', platform: 'Linux', description: 'Gather Linux Password Hashes' },
];
