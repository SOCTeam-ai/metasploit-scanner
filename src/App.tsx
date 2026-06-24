import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Activity,
  Cpu,
  Globe,
  Database,
  Terminal,
  Server,
  FileText,
  Key,
  Users,
  Search,
  Maximize2,
  Minimize2,
  Play,
  StopCircle,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Hash,
  Layers,
  HardDrive,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Info,
  Network,
  Download,
  AlertOctagon,
  Eye,
  Settings,
  X,
  Lock,
  Compass,
  Command,
  FileCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';

import {
  Host,
  Service,
  Vulnerability,
  Credential,
  ActiveSession,
  Task,
  ActiveTab,
} from './types';

import {
  initialHosts,
  initialServices,
  initialVulnerabilities,
  initialCredentials,
  initialSessions,
  metasploitModules,
} from './data';

export default function App() {
  // State variables for Metasploit Pro environment
  const [hosts, setHosts] = useState<Host[]>(initialHosts);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(initialVulnerabilities);
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials);
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't-1',
      name: 'Network Discovery Scan',
      status: 'completed',
      progress: 100,
      target: '192.168.1.0/24',
      startedAt: '2026-06-24 00:01',
      logs: [
        '[*] Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-24 00:01 UTC',
        '[*] Nmap scan report for ubuntu-web-prod (192.168.1.10)',
        '[*] Nmap scan report for win-dc-2003 (192.168.1.25)',
        '[*] Nmap scan report for embedded-router (192.168.1.42)',
        '[*] Nmap scan report for scada-plc (192.168.1.51)',
        '[*] Nmap scan report for unknown-client (192.168.1.99)',
        '[*] Host discovery completed. 5 hosts up.'
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom interactive simulations
  const [isConsoleMinimised, setIsConsoleMinimised] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(
    'Welcome to Metasploit Pro. All simulation systems are operational.'
  );

  // Active modals
  const [modalType, setModalType] = useState<'scan' | 'bruteforce' | 'exploit' | 'import' | 'report' | null>(null);
  
  // Modal Fields
  const [targetRange, setTargetRange] = useState('192.168.1.0/24');
  const [bruteforceService, setBruteforceService] = useState('SSH');
  const [bruteforceWordlist, setBruteforceWordlist] = useState('default_passwords.txt');
  const [exploitTargetHost, setExploitTargetHost] = useState('192.168.1.25');
  const [exploitPayload, setExploitPayload] = useState('windows/meterpreter/reverse_tcp');

  // Interactive console terminal logs and input
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '      .:okOOOo:.           ...           .:okOOOo:.',
    '    .OOb.       .oOB.      ,OOb.       .oOB.       .oOB.',
    '    OOb.           .      .OOb.       .OOb.           .',
    '   .OOb.                  OOb.        .OOb.',
    '    .OOb.                .OOb.         .OOb.',
    '      .oOOOo:.          .OOb.            .oOOOo:.',
    '            .OOb.       OOb.                   .OOb.',
    '             OOb.      .OOb.                    OOb.',
    '    .        OOb.      OOb.            .        OOb.',
    '    oOB.    .OOb.     .OOb.            oOB.    .OOb.',
    '     .:oOOOo:.        .OOb.             .:oOOOo:.',
    '',
    '=[ metasploit v6.3.15-dev                          ]',
    '+ -- --=[ 2315 exploits - 1211 auxiliary - 412 post       ]',
    '+ -- --=[ 968 payloads - 45 encoders - 11 nops            ]',
    '+ -- --=[ 9 evasion                                       ]',
    '',
    'msf6 > ',
  ]);
  const [selectedModule, setSelectedModule] = useState<string>('exploit/windows/smb/ms08_067_netapi');
  const [msfCurrentPath, setMsfCurrentPath] = useState('');
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Topology node selection
  const [selectedTopologyHost, setSelectedTopologyHost] = useState<Host | null>(null);

  // Custom simulation trigger logs & background interval
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [showNotification]);

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Network Simulation Runner
  const runSimulationTask = (
    name: string,
    target: string,
    onProgress: (progress: number, stepLogs: string[]) => void,
    onComplete: () => void
  ) => {
    const taskId = `t-${Date.now()}`;
    const newTask: Task = {
      id: taskId,
      name,
      status: 'running',
      progress: 0,
      target,
      startedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      logs: [`[*] Initializing Metasploit engine for ${name}...`, `[*] Target set to: ${target}`],
    };

    setTasks((prev) => [newTask, ...prev]);
    setActiveTab('Tasks');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      let logsToAdd: string[] = [];
      
      if (currentProgress === 20) {
        logsToAdd = [`[*] Scanning ports and resolving MAC addresses...`, `[+] Found response from target network node.`];
      } else if (currentProgress === 40) {
        logsToAdd = [`[*] Running vulnerability assessment scripts...`, `[*] Probing service banners and SSL configurations.`];
      } else if (currentProgress === 60) {
        logsToAdd = [`[*] Fingerprinting OS attributes via TCP/IP response patterns.`, `[+] Matched signature to known stack vulnerability.`];
      } else if (currentProgress === 80) {
        logsToAdd = [`[*] Attacking payload handler mapping...`, `[+] Injection payload accepted. Setting up reverse listener.`];
      } else if (currentProgress === 100) {
        logsToAdd = [`[+] Task '${name}' completed successfully.`, `[*] Database updated with newly harvested session nodes.`];
      }

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              progress: currentProgress,
              status: currentProgress === 100 ? 'completed' : 'running',
              logs: [...t.logs, ...logsToAdd],
            };
          }
          return t;
        })
      );

      onProgress(currentProgress, logsToAdd);

      if (currentProgress >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 1200);
  };

  // 1. SCAN SIMULATION ACTION
  const handleLaunchScan = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    setShowNotification(`Scan task launched for target range: ${targetRange}`);

    runSimulationTask(
      'Interactive Discovery Scan',
      targetRange,
      (progress, logs) => {
        // Append terminal activity logs
        setConsoleLogs((prev) => [
          ...prev,
          ...logs.map((log) => `[SCANNER] ${log}`),
        ]);
      },
      () => {
        // Add new target host dynamically to represent simulation success
        const newHostIp = '192.168.1.88';
        const alreadyExists = hosts.some((h) => h.ip === newHostIp);
        if (!alreadyExists) {
          const newHost: Host = {
            id: `h-${Date.now()}`,
            ip: newHostIp,
            name: 'target-discovered-host',
            mac: '00:15:5d:01:99:ab',
            os: 'Linux',
            status: 'Discovered',
            discoveredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
          const newSvc: Service = {
            id: `s-${Date.now()}`,
            hostId: newHost.id,
            hostIp: newHostIp,
            port: 8080,
            protocol: 'tcp',
            name: 'HTTP-Alt',
            banner: 'Apache Tomcat/9.0.58',
            status: 'active',
          };
          setHosts((prev) => [...prev, newHost]);
          setServices((prev) => [...prev, newSvc]);
        }
        setShowNotification('Discovery scan completed! Found 1 new host and service.');
      }
    );
  };

  // 2. BRUTEFORCE SIMULATION ACTION
  const handleLaunchBruteforce = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    setShowNotification(`Bruteforce attack started on service: ${bruteforceService}`);

    runSimulationTask(
      `Credential Bruteforce [${bruteforceService}]`,
      '192.168.1.10 (SSH)',
      (progress, logs) => {
        setConsoleLogs((prev) => [
          ...prev,
          ...logs.map((log) => `[BRUTELOG] ${log}`),
        ]);
      },
      () => {
        const newCred: Credential = {
          id: `c-${Date.now()}`,
          hostIp: '192.168.1.10',
          service: 'SSH',
          username: 'admin',
          privateType: 'Password',
          privateValue: 'shadow_hunter99',
          cracked: true,
          capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        setCredentials((prev) => [...prev, newCred]);

        // Upgrade host status
        setHosts((prev) =>
          prev.map((h) => (h.ip === '192.168.1.10' ? { ...h, status: 'Cracked' } : h))
        );

        setShowNotification('Bruteforce successful! New admin password recovered.');
      }
    );
  };

  // 3. EXPLOIT SIMULATION ACTION
  const handleLaunchExploit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    setShowNotification(`Exploiting ${exploitTargetHost} using ${selectedModule}`);

    runSimulationTask(
      `Remote Exploit Launch: ${selectedModule.split('/').pop()}`,
      exploitTargetHost,
      (progress, logs) => {
        setConsoleLogs((prev) => [
          ...prev,
          ...logs.map((log) => `[EXPLOITLOG] ${log}`),
        ]);
      },
      () => {
        // Upgrade host status to Shelled/Looted and open a Meterpreter session
        setHosts((prev) =>
          prev.map((h) => (h.ip === exploitTargetHost ? { ...h, status: 'Shelled' } : h))
        );

        const newSessionId = sessions.length + 1;
        const newSession: ActiveSession = {
          id: newSessionId,
          hostIp: exploitTargetHost,
          type: 'meterpreter',
          platform: 'windows/x64',
          port: 4444 + newSessionId,
          openedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'active',
        };

        setSessions((prev) => [newSession, ...prev]);

        // Set vulnerability to exploited
        setVulnerabilities((prev) =>
          prev.map((v) => (v.hostIp === exploitTargetHost ? { ...v, exploited: true } : v))
        );

        setConsoleLogs((prev) => [
          ...prev,
          `[+] Meterpreter session ${newSessionId} opened (${exploitTargetHost}:5555 -> 127.0.0.1:${4444 + newSessionId})`,
          `msf6 exploit(${selectedModule.split('/').pop()}) > `,
        ]);

        setShowNotification(`Exploit Succeeded! Meterpreter Session ${newSessionId} Opened successfully.`);
      }
    );
  };

  // MSF Console interactive line submit
  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const cmd = consoleInput.trim();
    const args = cmd.split(' ');
    const primary = args[0].toLowerCase();

    let output: string[] = [`msf6 > ${cmd}`];

    switch (primary) {
      case 'help':
      case '?':
        output.push(
          'Metasploit Console Commands Simulator:',
          '=====================================',
          '  help, ?                    Show this help menu',
          '  hosts                      List all discovered target hosts in db',
          '  services                   List all active scanned services',
          '  creds                      List all captured credentials/passwords',
          '  vulns                      List discovered system vulnerabilities',
          '  sessions                   List open Meterpreter / Shell channels',
          '  sessions -i <id>           Interact with a live active session',
          '  show exploits              Display simulator exploit modules list',
          '  use <module>               Select an active exploit/auxiliary module',
          '  show options               List required options for the selected module',
          '  set <option> <val>         Set configuration parameters for the module',
          '  exploit, run               Launch simulated exploit against selected target',
          '  db_nmap <ip>               Initiate immediate simulated port scan',
          '  clear                      Clear console screen history logs'
        );
        break;

      case 'clear':
        setConsoleLogs(['msf6 > ']);
        setConsoleInput('');
        return;

      case 'hosts':
        output.push(
          'Hosts in database:',
          '==================',
          'IP Address     MAC Address        OS         Status      Name',
          '----------     -----------        --         ------      ----'
        );
        hosts.forEach((h) => {
          output.push(
            `${h.ip.padEnd(14)} ${h.mac.padEnd(18)} ${h.os.padEnd(10)} ${h.status.padEnd(11)} ${h.name}`
          );
        });
        break;

      case 'services':
        output.push(
          'Services in database:',
          '=====================',
          'Host IP        Port   Proto  Name             Banner',
          '-------        ----   -----  ----             ------'
        );
        services.forEach((s) => {
          output.push(
            `${s.hostIp.padEnd(14)} ${s.port.toString().padEnd(6)} ${s.protocol.padEnd(6)} ${s.name.padEnd(16)} ${s.banner}`
          );
        });
        break;

      case 'creds':
        output.push(
          'Credentials Vault:',
          '==================',
          'Host IP        Service  Username     Type         Secret / Value',
          '-------        -------  --------     ----         --------------'
        );
        credentials.forEach((c) => {
          output.push(
            `${c.hostIp.padEnd(14)} ${c.service.padEnd(8)} ${c.username.padEnd(12)} ${c.privateType.padEnd(12)} ${c.privateValue}`
          );
        });
        break;

      case 'vulns':
        output.push(
          'Discovered Vulnerabilities:',
          '===========================',
          'Host IP        CVE Code      Exploited?  Title',
          '-------        --------      ----------  -----'
        );
        vulnerabilities.forEach((v) => {
          output.push(
            `${v.hostIp.padEnd(14)} ${v.cve.padEnd(13)} ${(v.exploited ? 'YES' : 'NO').padEnd(11)} ${v.title}`
          );
        });
        break;

      case 'sessions':
        if (args[1] === '-i') {
          const idStr = args[2];
          const id = parseInt(idStr, 10);
          const found = sessions.find((s) => s.id === id);
          if (found) {
            output.push(
              `[*] Interacting with session ${id}...`,
              `[*] Welcome to Meterpreter console for node ${found.hostIp}!`,
              `meterpreter > sysinfo`,
              `Computer        : ${found.hostIp === '192.168.1.25' ? 'WIN-DC-2003-SRV' : 'LINUX-HOST-GW'}`,
              `OS              : ${found.platform}`,
              `Architecture    : x64`,
              `Meterpreter     : x86/windows`,
              `meterpreter > getuid`,
              `Server username : NT AUTHORITY\\SYSTEM`,
              `meterpreter > background`,
              `[*] Backgrounding session ${id}...`
            );
          } else {
            output.push(`[-] Session ${idStr} not found. Use 'sessions' to see live channels.`);
          }
        } else {
          output.push(
            'Active Sessions:',
            '===============',
            'Id  Type         Information                        Connection',
            '--  ----         -----------                        ----------'
          );
          sessions.forEach((s) => {
            output.push(
              `${s.id.toString().padEnd(3)} ${s.type.padEnd(12)} ${s.platform.padEnd(34)} ${s.hostIp}:5555 -> 127.0.0.1:${s.port}`
            );
          });
        }
        break;

      case 'show':
        if (args[1] === 'exploits' || args[1] === 'modules') {
          output.push(
            'Exploits & Auxiliary Modules Simulator:',
            '======================================'
          );
          metasploitModules.forEach((m) => {
            output.push(`  ${m.name.padEnd(45)}  [${m.platform}] - ${m.description}`);
          });
        } else {
          output.push(`[-] Unsupported category. Try 'show exploits'`);
        }
        break;

      case 'use':
        const targetModule = args[1];
        if (targetModule) {
          const exists = metasploitModules.some((m) => m.name === targetModule);
          if (exists) {
            setSelectedModule(targetModule);
            setMsfCurrentPath(targetModule);
            output.push(`[*] Selected module: ${targetModule}`);
          } else {
            output.push(`[-] Module not found in simulator registry: ${targetModule}`);
          }
        } else {
          output.push('[-] Usage: use <module_path>');
        }
        break;

      case 'show_options':
      case 'options':
        output.push(
          `Module Options (${selectedModule}):`,
          '=====================================',
          'Name       Current Setting        Required  Description',
          '----       ---------------        --------  -----------',
          `RHOSTS     ${exploitTargetHost.padEnd(22)} yes       Target address block or range`,
          `RPORT      445                    yes       The Target Port`,
          `PAYLOAD    ${exploitPayload.padEnd(22)} yes       Metasploit payload module`,
          'LHOST      127.0.0.1              yes       The listen address for reverse connection',
          'LPORT      4444                   yes       The listen port'
        );
        break;

      case 'set':
        const opt = args[1]?.toUpperCase();
        const val = args[2];
        if (opt && val) {
          if (opt === 'RHOSTS') {
            setExploitTargetHost(val);
            output.push(`RHOSTS => ${val}`);
          } else if (opt === 'PAYLOAD') {
            setExploitPayload(val);
            output.push(`PAYLOAD => ${val}`);
          } else {
            output.push(`[+] ${opt} configured to: ${val}`);
          }
        } else {
          output.push('[-] Usage: set <OPTION_NAME> <VALUE>');
        }
        break;

      case 'exploit':
      case 'run':
        output.push(
          `[*] Launching exploit against ${exploitTargetHost}...`,
          `[*] Payload handler binding on 127.0.0.1:4444`,
          `[*] Target matched vulnerability signature.`
        );
        // We run a mini synchronous exploit mock in the terminal window
        setTimeout(() => {
          setHosts((prev) =>
            prev.map((h) => (h.ip === exploitTargetHost ? { ...h, status: 'Shelled' } : h))
          );
          const newSessionId = sessions.length + 1;
          const newSess: ActiveSession = {
            id: newSessionId,
            hostIp: exploitTargetHost,
            type: 'meterpreter',
            platform: 'windows/x86',
            port: 4444 + newSessionId,
            openedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'active',
          };
          setSessions((prev) => [newSess, ...prev]);
          setConsoleLogs((prevLogs) => [
            ...prevLogs,
            `[+] Meterpreter session ${newSessionId} opened (${exploitTargetHost}:445 -> 127.0.0.1:${4444 + newSessionId})`,
            'meterpreter > sysinfo',
            'Computer        : TARGET-NODE-WINSRV',
            'OS              : Windows Server 2003',
            'meterpreter > background',
            '[*] Backgrounding session...',
            'msf6 > '
          ]);
        }, 1500);
        break;

      case 'db_nmap':
        const targetIp = args[1] || '192.168.1.10';
        output.push(
          `[*] launching db_nmap scan for ${targetIp}...`,
          `[*] Host is online, active latency: 4ms`,
          `[+] Found open port: 22/tcp (SSH)`,
          `[+] Found open port: 80/tcp (HTTP)`,
          `[+] Found open port: 443/tcp (HTTPS)`,
          `[*] Port scan completed, matched service database records successfully.`
        );
        break;

      default:
        output.push(`[-] Unknown command: ${cmd}. Type 'help' for available options.`);
        break;
    }

    output.push(msfCurrentPath ? `msf6 exploit(${msfCurrentPath.split('/').pop()}) > ` : 'msf6 > ');
    setConsoleLogs((prev) => [...prev, ...output]);
    setConsoleInput('');
  };

  // Helper calculation metrics for charts
  const totalHosts = hosts.length;
  const discoveredCount = hosts.filter((h) => h.status === 'Discovered').length;
  const crackedCount = hosts.filter((h) => h.status === 'Cracked').length;
  const shelledCount = hosts.filter((h) => h.status === 'Shelled').length;
  const lootedCount = hosts.filter((h) => h.status === 'Looted').length;

  const targetSystemStatusData = [
    { name: 'Discovered', value: discoveredCount, color: '#2563eb' }, // Primary Royal Blue
    { name: 'Cracked', value: crackedCount, color: '#f59e0b' },      // Amber
    { name: 'Shelled', value: shelledCount, color: '#ef4444' },      // Red
    { name: 'Looted', value: lootedCount, color: '#06b6d4' },        // Cyan
  ];

  // OS Distribution calculation
  const osCount = hosts.reduce(
    (acc, host) => {
      acc[host.os] = (acc[host.os] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const osDistributionData = [
    { name: 'embedded', value: osCount['embedded'] || 0, color: '#2563eb' },
    { name: 'Unknown', value: osCount['Unknown'] || 0, color: '#f59e0b' },
    { name: 'Linux', value: osCount['Linux'] || 0, color: '#ef4444' },
    { name: 'Windows 2003', value: osCount['Windows'] || 0, color: '#06b6d4' },
    { name: 'RTOS', value: osCount['RTOS'] || 0, color: '#10b981' }, // Emerald
  ];

  // Network services count calculation
  const serviceCount = services.reduce(
    (acc, svc) => {
      acc[svc.name] = (acc[svc.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const networkServicesData = [
    { name: 'SSH Services', value: serviceCount['SSH'] || 0, color: '#2563eb' },
    { name: 'MS-WBT-SERVER Services', value: serviceCount['MS-WBT-SERVER'] || 0, color: '#f59e0b' },
    { name: 'WINRM Services', value: serviceCount['WINRM'] || 0, color: '#ef4444' },
    { name: 'POP Services', value: serviceCount['POP'] || 0, color: '#06b6d4' },
    { name: 'HTTPS Services', value: serviceCount['HTTPS'] || 0, color: '#10b981' },
  ];

  // 24 Hour activity trend
  const projectActivityData = [
    { time: '00:00', activity: 2 },
    { time: '04:00', activity: 3 },
    { time: '08:00', activity: 1 },
    { time: '12:00', activity: 4 },
    { time: '16:00', activity: 2 },
    { time: '20:00', activity: 1 },
    { time: '23:59', activity: 14 },
  ];

  // Report download simulation
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    setShowNotification('Report generation queued. Preparing PDF metadata file...');
    setTimeout(() => {
      alert('Metasploit Pro simulated penetration report downloaded successfully! (Format: Standard executive PDF summary)');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-gray-800 flex flex-col antialiased">
      
      {/* HEADER BAR (Identical style to standard Metasploit interface) */}
      <header className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#e95420] flex items-center gap-1.5">
              <Shield className="w-6 h-6 stroke-[2.5]" /> METASPLOIT
            </span>
            <div className="h-5 w-[1px] bg-gray-300 mx-2" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Metasploit Pro</span>
              <span className="text-[10px] text-gray-400">Update 5.0.0 sysin</span>
            </div>
          </div>
        </div>

        {/* Global state notification pill */}
        {showNotification && (
          <div className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-md text-xs text-blue-700 animate-pulse flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>{showNotification}</span>
          </div>
        )}

        <div className="flex items-center gap-5 text-gray-500 text-sm">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600 transition-colors">
            <Compass className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-600">Simulating Live Environment</span>
          </div>
          <div className="relative cursor-pointer hover:text-gray-900 transition-colors">
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">2</span>
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div className="cursor-pointer hover:text-gray-900">
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="cursor-pointer hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
            <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
              M
            </div>
            <span className="font-medium text-xs text-gray-700">Security Admin</span>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDE NAVIGATION (Perfect reconstruction of sidebar categories) */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto select-none shrink-0">
          <div className="p-4 space-y-6">
            
            {/* Category 1: Projects */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Projects</span>
                <Plus className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-900" onClick={() => setModalType('scan')} />
              </div>
              <button
                onClick={() => setActiveTab('Dashboard')}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'Dashboard'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-4 h-4 text-gray-500" />
                <span>Project Overview</span>
              </button>
            </div>

            {/* Category 2: Analysis */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Analysis</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="space-y-0.5 pl-1.5">
                {[
                  { name: 'Hosts', icon: HardDrive, tab: 'Hosts' },
                  { name: 'Services', icon: Server, tab: 'Services' },
                  { name: 'Discovered Vulnerabilities', icon: AlertTriangle, tab: 'Vulnerabilities' },
                  { name: 'Captured Data', icon: Database, tab: 'Dashboard' },
                  { name: 'Credentials', icon: Key, tab: 'Credentials' },
                  { name: 'Network Topology', icon: Network, tab: 'Topology' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.tab as ActiveTab)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                      activeTab === item.tab
                        ? 'text-blue-700 bg-blue-50/50 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category 3: Sessions */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Active Targets</span>
              </div>
              <button
                onClick={() => setActiveTab('Sessions')}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'Sessions'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Terminal className="w-4 h-4 text-green-600 animate-pulse" />
                <div className="flex-1 flex items-center justify-between">
                  <span>Sessions</span>
                  <span className="bg-green-100 text-green-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    {sessions.length}
                  </span>
                </div>
              </button>
            </div>

            {/* Category 4: Web Apps */}
            <div className="space-y-1">
              <div className="px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Web Apps</span>
              </div>
              <button
                onClick={() => setActiveTab('WebApps')}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'WebApps'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Web App Assessments</span>
              </button>
            </div>

            {/* Category 5: Modules */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Modules</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="space-y-0.5 pl-1.5">
                <button
                  onClick={() => setActiveTab('Modules')}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    activeTab === 'Modules' ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <span>Module Registry</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('Console');
                    setConsoleLogs(prev => [...prev, '[*] Loading Metasploit Resource script simulation hook...']);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FileCode className="w-3.5 h-3.5 text-gray-400" />
                  <span>Resource Scripts</span>
                </button>
              </div>
            </div>

            {/* Category 6: Tasks */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Tasks</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="space-y-0.5 pl-1.5">
                <button
                  onClick={() => setActiveTab('Tasks')}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    activeTab === 'Tasks' ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-gray-400" />
                  <span>Show Tasks ({tasks.length})</span>
                </button>
              </div>
            </div>

            {/* Category 7: Reports */}
            <div className="space-y-1">
              <div className="px-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <span>Reports</span>
              </div>
              <button
                onClick={() => setActiveTab('Reports')}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'Reports'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Executive Reports</span>
              </button>
            </div>

          </div>

          {/* Quick Stats sidebar footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Database Connection</span>
              <span className="text-green-600 font-bold flex items-center gap-1">● MSF_DB</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Active Exploit Modules</span>
              <span className="font-semibold text-gray-700">2,315</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Host Console</span>
              <button 
                onClick={() => setActiveTab('Console')}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Terminal className="w-3 h-3" /> msfconsole
              </button>
            </div>
          </div>
        </aside>

        {/* WORKSPACE & PANELS */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* ACTION TOOLBAR (Perfect replica of buttons: Scan, Import, Nexpose Scan, WebScan, Bruteforce, Exploit, Campaign, Stop all tasks) */}
          <section className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setModalType('scan')}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded font-medium shadow-xs hover:border-gray-400 transition-all flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Scan</span>
              </button>
              <button
                onClick={() => setModalType('import')}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded font-medium shadow-xs hover:border-gray-400 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Import</span>
              </button>
              <button
                onClick={() => {
                  setShowNotification('Searching Nexpose scan targets on local segment...');
                  setModalType('scan');
                }}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded font-medium shadow-xs hover:border-gray-400 transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>Nexpose Scan</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('WebApps');
                  setShowNotification('Select web server node below to configure spider assessment.');
                }}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded font-medium shadow-xs hover:border-gray-400 transition-all flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>WebScan</span>
              </button>
              <button
                onClick={() => setModalType('bruteforce')}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded font-medium shadow-xs hover:border-gray-400 transition-all flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Bruteforce</span>
              </button>
              <button
                onClick={() => setModalType('exploit')}
                className="bg-[#e95420] hover:bg-[#d84315] text-white text-xs px-4 py-1.5 rounded font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Exploit</span>
              </button>
              <button
                onClick={() => {
                  setShowNotification('Simulation: Campaign auto-routing initialized.');
                }}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1.5 rounded font-medium shadow-xs hover:border-gray-400 transition-all flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span>Campaign</span>
              </button>
              <div className="h-6 w-[1px] bg-gray-200 mx-1" />
              <button
                onClick={() => {
                  setTasks((prev) => prev.map((t) => ({ ...t, status: 'completed', progress: 100 })));
                  setShowNotification('All background tasks successfully aborted.');
                }}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop all tasks</span>
              </button>
            </div>

            {/* Quick Filter Search Input */}
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hosts, modules, services..."
                className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white text-xs pl-9 pr-3 py-1.5 rounded-md border border-transparent focus:border-gray-300 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </section>

          {/* breadcrumb path representation */}
          <div className="bg-gray-100 px-6 py-2 border-b border-gray-200 flex items-center text-[11px] text-gray-500 gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>/</span>
            <span>network scan</span>
            {activeTab !== 'Dashboard' && (
              <>
                <span>/</span>
                <span className="text-gray-700 font-semibold">{activeTab.toLowerCase()}</span>
              </>
            )}
          </div>

          {/* MAIN DYNAMIC TAB CONTENT */}
          <div className="p-6 space-y-6 flex-1">
            
            {/* TAB 1: DASHBOARD (Perfect visual matching of the Metasploit Pro dashboard charts & details) */}
            {activeTab === 'Dashboard' && (
              <div className="space-y-6">
                
                {/* Dashboard Title Header */}
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                  <p className="text-xs text-gray-500">Live summary of active workspace endpoints, OS distribution, and attack sessions.</p>
                </div>

                {/* Grid 1: Donut & Line Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Card 1: Target System Status (Left Donut) */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-3">Target System Status</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-48">
                      <div className="w-36 h-36 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={targetSystemStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={38}
                              outerRadius={58}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {targetSystemStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-extrabold text-gray-800">{totalHosts}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-semibold">Total Nodes</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="space-y-2 text-xs">
                        {targetSystemStatusData.map((d, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="font-medium text-gray-700 min-w-[70px]">{d.value} {d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Operating Systems (Top 5) (Right Donut) */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-3">Operating Systems (Top 5)</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-48">
                      <div className="w-36 h-36 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={osDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={38}
                              outerRadius={58}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {osDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-extrabold text-gray-800">{Object.keys(osCount).length}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-semibold">OS Classes</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="space-y-2 text-xs">
                        {osDistributionData.map((d, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="font-medium text-gray-700 min-w-[120px]">{d.value} {d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Project Activity (24 Hours) (Left Sparkline) */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-2">Project Activity (24 hours)</h3>
                    </div>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectActivityData}>
                          <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <RechartsTooltip />
                          <Line
                            type="monotone"
                            dataKey="activity"
                            stroke="#0284c7"
                            strokeWidth={2.5}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Card 4: Network Services (Top 5) (Right Donut) */}
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-3">Network Services (Top 5)</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-48">
                      <div className="w-36 h-36 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={networkServicesData}
                              cx="50%"
                              cy="50%"
                              innerRadius={38}
                              outerRadius={58}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {networkServicesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-extrabold text-gray-800">{services.length}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-semibold">Total Svcs</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="space-y-2 text-xs">
                        {networkServicesData.map((d, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="font-medium text-gray-700 min-w-[150px]">{d.value} {d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Overview Tables block matching lower half */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
                  <h2 className="text-base font-bold text-gray-900 border-b pb-3 mb-4">Overview - Project network scan</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Discovery Metrics Column */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-blue-600" />
                        <span>Discovery Outcomes</span>
                      </h3>
                      
                      <div className="space-y-3 pl-1">
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Discovered Target Hosts</span>
                          <span className="font-bold text-blue-600 text-lg cursor-pointer hover:underline" onClick={() => setActiveTab('Hosts')}>
                            {hosts.length} hosts
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Identified Services Detected</span>
                          <span className="font-semibold text-gray-800">{services.length} services</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-600 font-semibold text-red-600">Vulnerabilities Identified</span>
                          <span className="font-bold text-red-600 hover:underline cursor-pointer" onClick={() => setActiveTab('Vulnerabilities')}>
                            {vulnerabilities.length} critical vulnerabilities
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Applicable Attack Modules</span>
                          <span className="font-semibold text-orange-600">{metasploitModules.length} Modules available</span>
                        </div>
                      </div>

                      {/* Quick Action triggers */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setModalType('scan')}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-semibold transition-colors"
                        >
                          Scan Target
                        </button>
                        <button
                          onClick={() => setModalType('import')}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-semibold transition-colors"
                        >
                          Import data
                        </button>
                      </div>
                    </div>

                    {/* Penetration Outcome Column */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-orange-600" />
                        <span>Penetration Metrics</span>
                      </h3>

                      <div className="space-y-3 pl-1">
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Active Reverse Shell Sessions</span>
                          <span className="font-bold text-green-600 text-lg cursor-pointer hover:underline" onClick={() => setActiveTab('Sessions')}>
                            {sessions.length} sessions open
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Compromised/Cracked Credentials</span>
                          <span className="font-semibold text-gray-800">
                            {credentials.filter((c) => c.cracked).length} passwords recovered
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-600 text-orange-600 font-semibold">Cracked Hashes / Keys</span>
                          <span className="font-bold text-orange-600">{credentials.filter((c) => c.privateType === 'NTLM Hash' || c.privateType === 'SSH Key').length} SSH keys/hashes</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Non-Replayable Hashes</span>
                          <span className="font-semibold text-gray-500">0 locked hashes</span>
                        </div>
                      </div>

                      {/* Penetration action triggers */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setModalType('bruteforce')}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-semibold transition-colors"
                        >
                          Bruteforce Auth
                        </button>
                        <button
                          onClick={() => setModalType('exploit')}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs px-3 py-1.5 rounded font-semibold transition-colors"
                        >
                          Automated Exploit
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: HOSTS */}
            {activeTab === 'Hosts' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Hosts List</h2>
                    <p className="text-xs text-gray-500">Live inventory of scanned targets in current workspace subnet.</p>
                  </div>
                  <button
                    onClick={() => setModalType('scan')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Target Range
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b">
                      <tr>
                        <th className="p-3">IP Address</th>
                        <th className="p-3">Hostname</th>
                        <th className="p-3">MAC Address</th>
                        <th className="p-3">Operating System</th>
                        <th className="p-3">Simulation Status</th>
                        <th className="p-3">Discovered At</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {hosts
                        .filter((h) => h.ip.includes(searchQuery) || h.name.includes(searchQuery))
                        .map((h) => (
                          <tr key={h.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-semibold text-gray-900">{h.ip}</td>
                            <td className="p-3 text-gray-600">{h.name}</td>
                            <td className="p-3 text-gray-500">{h.mac}</td>
                            <td className="p-3">
                              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                {h.os}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  h.status === 'Discovered'
                                    ? 'bg-blue-100 text-blue-800'
                                    : h.status === 'Cracked'
                                    ? 'bg-amber-100 text-amber-800'
                                    : h.status === 'Shelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-cyan-100 text-cyan-800'
                                }`}
                              >
                                {h.status}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500 text-[11px]">{h.discoveredAt}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setExploitTargetHost(h.ip);
                                  setModalType('exploit');
                                }}
                                className="text-red-600 hover:text-red-900 font-semibold"
                              >
                                Exploit
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SERVICES */}
            {activeTab === 'Services' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Active Detected Services</h2>
                  <p className="text-xs text-gray-500">Listing of open ports, daemon services, and banners recovered during scan.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b">
                      <tr>
                        <th className="p-3">Target Host</th>
                        <th className="p-3">Port</th>
                        <th className="p-3">Protocol</th>
                        <th className="p-3">Service Name</th>
                        <th className="p-3">Banner Header</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {services
                        .filter((s) => s.hostIp.includes(searchQuery) || s.name.includes(searchQuery))
                        .map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-semibold text-gray-900">{s.hostIp}</td>
                            <td className="p-3 font-semibold text-blue-600">{s.port}</td>
                            <td className="p-3 text-gray-500 uppercase">{s.protocol}</td>
                            <td className="p-3 font-bold text-gray-700">{s.name}</td>
                            <td className="p-3 text-gray-500 text-[11px] max-w-xs truncate">{s.banner}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  s.status === 'exploited' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: VULNERABILITIES */}
            {activeTab === 'Vulnerabilities' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Discovered Vulnerabilities</h2>
                  <p className="text-xs text-gray-500">Identified CVE flaws in subnet hosts, map-correlated to Metasploit exploits.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {vulnerabilities
                    .filter((v) => v.hostIp.includes(searchQuery) || v.title.includes(searchQuery))
                    .map((v) => (
                      <div
                        key={v.id}
                        className="p-4 rounded-lg border border-gray-200 hover:border-red-400 transition-colors bg-white shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-100 text-red-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase">
                              {v.severity}
                            </span>
                            <span className="font-bold text-gray-900">{v.cve}</span>
                            <span className="text-xs text-gray-400">| Host Target: <strong className="text-gray-700 font-mono">{v.hostIp}</strong></span>
                          </div>
                          <div>
                            {v.exploited ? (
                              <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                Exploit Succeeded
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedModule(v.applicableModule);
                                  setExploitTargetHost(v.hostIp);
                                  setModalType('exploit');
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-3 py-1 rounded font-bold uppercase tracking-wider transition-colors"
                              >
                                Launch {v.applicableModule.split('/').pop()}
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{v.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{v.description}</p>
                        </div>

                        <div className="bg-gray-50 p-2.5 rounded border border-gray-100 text-xs text-gray-600 font-mono flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-blue-600" />
                          <span>Metasploit module path: <strong>{v.applicableModule}</strong></span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 5: CREDENTIALS */}
            {activeTab === 'Credentials' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Credentials Database Vault</h2>
                    <p className="text-xs text-gray-500">Collected usernames, private passwords, and hashes cracked from live shells.</p>
                  </div>
                  <button
                    onClick={() => setModalType('bruteforce')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" /> Bruteforce Targets
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b">
                      <tr>
                        <th className="p-3">Host Node</th>
                        <th className="p-3">Port Service</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Secret Type</th>
                        <th className="p-3">Plaintext / Hash</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Recovered At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {credentials
                        .filter((c) => c.hostIp.includes(searchQuery) || c.username.includes(searchQuery))
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-semibold text-gray-900">{c.hostIp}</td>
                            <td className="p-3 text-gray-600">{c.service}</td>
                            <td className="p-3 font-bold text-gray-700">{c.username}</td>
                            <td className="p-3">
                              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                                {c.privateType}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500 max-w-xs truncate">{c.privateValue}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  c.cracked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {c.cracked ? 'Cracked' : 'Captured'}
                              </span>
                            </td>
                            <td className="p-3 text-gray-400 text-[11px]">{c.capturedAt}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: SESSIONS */}
            {activeTab === 'Sessions' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Active Shell & Meterpreter Channels</h2>
                  <p className="text-xs text-gray-500">Established exploit callbacks. Launch standard console terminal command prompts from here.</p>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-12 space-y-3 bg-gray-50 rounded-lg">
                    <Terminal className="w-12 h-12 text-gray-300 mx-auto" />
                    <h3 className="text-sm font-bold text-gray-700">No Active Sessions Open</h3>
                    <p className="text-xs text-gray-500">Go to the module registry or click 'Exploit' to run simulated reverse TCP payloads.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Sessions list */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Open Shell Sessions</h3>
                      <div className="space-y-3">
                        {sessions.map((s) => (
                          <div
                            key={s.id}
                            className="p-4 rounded-lg border border-gray-200 hover:border-green-400 bg-white transition-all shadow-xs flex justify-between items-center"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-800 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                                  ID {s.id}
                                </span>
                                <span className="font-bold text-sm text-gray-800">{s.hostIp}</span>
                              </div>
                              <p className="text-xs text-gray-500 font-mono">{s.platform} | Local Port: {s.port}</p>
                              <p className="text-[10px] text-gray-400">Opened: {s.openedAt}</p>
                            </div>

                            <button
                              onClick={() => {
                                setActiveTab('Console');
                                setConsoleLogs((prev) => [
                                  ...prev,
                                  `msf6 > sessions -i ${s.id}`,
                                  `[*] Interacting with session ${s.id}...`,
                                  `meterpreter > sysinfo`,
                                  `Computer        : TARGET-CONSOLE-NODE`,
                                  `OS              : ${s.platform}`,
                                  `meterpreter > `,
                                ]);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Terminal className="w-3.5 h-3.5" />
                              <span>Interact</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exploit guide box */}
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-green-600" />
                        <span>Interactive Meterpreter Simulator</span>
                      </h3>
                      <p className="text-xs text-gray-600">
                        Meterpreter is an advanced, dynamically extensible payload that uses in-memory DLL injection stagers. Click the <strong>Interact</strong> button or type <code>sessions -i 1</code> in the bottom terminal panel to run direct reverse commands.
                      </p>
                      <div className="space-y-1 text-xs text-gray-500 bg-white p-3 rounded border border-gray-100 font-mono">
                        <div className="text-green-700"># Try running these commands inside the sessions:</div>
                        <div>- <code>sysinfo</code> (Query system metadata)</div>
                        <div>- <code>hashdump</code> (Dump local NTLM password hashes)</div>
                        <div>- <code>shell</code> (Drop into a terminal shell prompt)</div>
                        <div>- <code>loot</code> (Harvest system configuration files)</div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 7: TOPOLOGY (Visual interactive canvas/nodes) */}
            {activeTab === 'Topology' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Network Topology Map</h2>
                  <p className="text-xs text-gray-500">Interactive workspace network graph. Click nodes to run automated privilege escalation triggers.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Visual Graph Area */}
                  <div className="lg:col-span-2 bg-[#0b0f19] h-96 rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-800">
                    
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

                    {/* Source Controller Center Node */}
                    <div className="absolute flex flex-col items-center">
                      <div className="w-14 h-14 bg-red-600 rounded-full border-4 border-red-900/50 flex items-center justify-center animate-pulse z-10">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-[10px] text-red-400 font-bold font-mono mt-1">MSF_CONSOLE (Attacker)</span>
                    </div>

                    {/* Discovered Satellite Host Nodes */}
                    {hosts.map((h, i) => {
                      // Distribute nodes in orbit positions
                      const angle = (i * (360 / hosts.length) * Math.PI) / 180;
                      const radius = 130; // Radius of orbit
                      const leftPos = `calc(50% + ${Math.cos(angle) * radius}px - 2rem)`;
                      const topPos = `calc(50% + ${Math.sin(angle) * radius}px - 2rem)`;

                      const isShelled = h.status === 'Shelled' || h.status === 'Looted';

                      return (
                        <button
                          key={h.id}
                          onClick={() => setSelectedTopologyHost(h)}
                          style={{ left: leftPos, top: topPos }}
                          className={`absolute w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                            selectedTopologyHost?.id === h.id
                              ? 'border-2 border-white scale-110 z-20'
                              : 'border border-gray-700'
                          } ${
                            isShelled
                              ? 'bg-red-950/80 hover:bg-red-900/90'
                              : 'bg-slate-900/80 hover:bg-slate-800/90'
                          }`}
                        >
                          <Server
                            className={`w-6 h-6 ${isShelled ? 'text-red-500' : 'text-blue-400'} mb-1`}
                          />
                          <span className="text-[8px] text-gray-300 font-mono truncate w-14 text-center">
                            {h.ip.split('.').slice(2).join('.')}
                          </span>
                          <span
                            className={`text-[6px] px-1 rounded uppercase font-extrabold ${
                              isShelled ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {h.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sidebar Detail Card */}
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Network className="w-5 h-5 text-blue-600" />
                      <span>Node Inspector</span>
                    </h3>

                    {selectedTopologyHost ? (
                      <div className="space-y-4">
                        <div className="bg-white p-3.5 rounded border border-gray-200 font-mono text-xs space-y-2">
                          <div className="font-bold text-gray-900 border-b pb-1.5 mb-1.5 flex justify-between">
                            <span>{selectedTopologyHost.name}</span>
                            <span className="text-blue-600 font-semibold">{selectedTopologyHost.ip}</span>
                          </div>
                          <div>OS Platform: <strong className="text-gray-700">{selectedTopologyHost.os}</strong></div>
                          <div>Host Status: <strong className="text-red-600 uppercase">{selectedTopologyHost.status}</strong></div>
                          <div>Mac Address: <span className="text-gray-500">{selectedTopologyHost.mac}</span></div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setSelectedModule('exploit/windows/smb/ms08_067_netapi');
                              setExploitTargetHost(selectedTopologyHost.ip);
                              setModalType('exploit');
                            }}
                            className="w-full bg-[#e95420] hover:bg-[#d84315] text-white text-xs py-2 rounded font-semibold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Exploit Node</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('Services');
                              setSearchQuery(selectedTopologyHost.ip);
                            }}
                            className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs py-2 rounded font-semibold transition-colors"
                          >
                            Inspect Detected Ports
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400 text-xs">
                        Click on any target host node in the topology map graph orbit to load attributes.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 8: CONSOLE (Interactive direct prompt) */}
            {activeTab === 'Console' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Direct msfconsole Shell Prompt</h2>
                  <p className="text-xs text-gray-500">Run actual simulated module selections, target definitions, and exploit chains.</p>
                </div>

                <div className="bg-[#0b0f19] rounded-lg p-5 font-mono text-xs text-slate-300 h-96 flex flex-col justify-between overflow-y-auto">
                  <div className="flex-1 space-y-1 overflow-y-auto max-h-80">
                    {consoleLogs.map((log, index) => (
                      <pre key={index} className="whitespace-pre-wrap leading-relaxed">
                        {log}
                      </pre>
                    ))}
                    <div ref={consoleBottomRef} />
                  </div>

                  <form onSubmit={handleConsoleSubmit} className="flex gap-2 pt-4 border-t border-gray-800">
                    <span className="text-orange-500 font-bold select-none">
                      {msfCurrentPath ? `msf6 exploit(${msfCurrentPath.split('/').pop()}) >` : 'msf6 >'}
                    </span>
                    <input
                      type="text"
                      value={consoleInput}
                      onChange={(e) => setConsoleInput(e.target.value)}
                      placeholder="Type 'help' or commands..."
                      className="flex-1 bg-transparent text-slate-100 border-none focus:outline-none focus:ring-0 font-mono text-xs"
                      autoFocus
                    />
                  </form>
                </div>
              </div>
            )}

            {/* TAB 9: WEB APPS */}
            {activeTab === 'WebApps' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Web App Assessments</h2>
                  <p className="text-xs text-gray-500">Metasploit Pro automated spiders and scanners targeting HTTP APIs, credentials, and SQL injection flaws.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left config form */}
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Web Server Audit Configuration</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Target Endpoint / URL</label>
                        <input
                          type="text"
                          defaultValue="https://192.168.1.10:443"
                          className="w-full bg-white border rounded px-3 py-1.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Audit Type</label>
                        <select className="w-full bg-white border rounded px-3 py-1.5">
                          <option>Quick OWASP Top 10 check</option>
                          <option>Spider & Route mapping</option>
                          <option>Full blind SQL Injection scan</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          setShowNotification('Spider scan initialized for https://192.168.1.10:443');
                          runSimulationTask(
                            'Web Spider Audit',
                            'https://192.168.1.10:443',
                            (progress, logs) => {},
                            () => {
                              alert('OWASP Top 10 web scan completed. No active injection endpoints found on target.');
                            }
                          );
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded text-xs transition-colors"
                      >
                        Launch Web Spider
                      </button>
                    </div>
                  </div>

                  {/* Right description info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span>Web application vulnerability mapper</span>
                    </h3>
                    <p className="text-xs text-gray-600">
                      Metasploit WebScan explores standard web platforms to extract directory index directories, detect misconfigured proxy ports, execute cross-site scripting (XSS) filters, and discover unsecured admin panel portals.
                    </p>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800 space-y-1">
                      <div className="font-bold">Recommendation:</div>
                      <div>Always ensure that Nexpose is connected to correlate application CVE databases dynamically with live Metasploit module releases.</div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 10: MODULES */}
            {activeTab === 'Modules' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Metasploit Module Registry</h2>
                  <p className="text-xs text-gray-500 font-mono">Registry of configured and verified exploits, auxiliaries, and post exploitation scripts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metasploitModules.map((m, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-400 bg-white transition-all shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-100 text-blue-800 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                          {m.type}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                          {m.platform}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-900 font-mono truncate">{m.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">{m.description}</p>
                      </div>

                      <div className="flex gap-2 pt-1.5 border-t">
                        <button
                          onClick={() => {
                            setSelectedModule(m.name);
                            setModalType('exploit');
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] px-2.5 py-1 rounded font-semibold transition-colors"
                        >
                          Use Module
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 11: TASKS */}
            {activeTab === 'Tasks' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Simulation Tasks & Pipelines</h2>
                  <p className="text-xs text-gray-500">Live progress tracking and logs from automated Metasploit payload tasks.</p>
                </div>

                <div className="space-y-4">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-lg border border-gray-200 bg-white shadow-xs space-y-4"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{t.name}</h3>
                          <p className="text-xs text-gray-400 font-mono">Target Address: {t.target} | Date: {t.startedAt}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              t.status === 'running'
                                ? 'bg-blue-100 text-blue-800 animate-pulse'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-xs font-semibold">{t.progress}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>

                      {/* Log Console Output for the Task */}
                      <div className="bg-gray-900 text-slate-300 p-4 rounded-md font-mono text-[11px] h-36 overflow-y-auto space-y-1">
                        {t.logs.map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 12: REPORTS */}
            {activeTab === 'Reports' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Metasploit Pro Audit Reports</h2>
                    <p className="text-xs text-gray-500">Generate, download, and review professional standard executive vulnerability & remediation reports.</p>
                  </div>
                  <button
                    onClick={() => setModalType('report')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Create standard report
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Generated Reports logs list */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Available Reports History</h3>
                    
                    <div className="p-4 rounded-lg border border-gray-200 bg-white flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          <span className="font-bold text-xs text-gray-800">Executive Vulnerability Report</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Created: 2026-06-24 00:45 | Size: 1.2MB | Format: PDF</p>
                      </div>
                      <button
                        onClick={() => alert('Simulated PDF file downloaded successfully!')}
                        className="text-blue-600 hover:text-blue-900 text-xs font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-200 bg-white flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          <span className="font-bold text-xs text-gray-800">Remediation Action Plan Summary</span>
                        </div>
                        <p className="text-[10px] text-gray-400">Created: 2026-06-24 00:30 | Size: 480KB | Format: HTML</p>
                      </div>
                      <button
                        onClick={() => alert('Simulated HTML report saved.')}
                        className="text-blue-600 hover:text-blue-900 text-xs font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>

                  {/* PDF design mock explanation */}
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Executive Presentation Generator</h3>
                    <p className="text-xs text-gray-600">
                      Metasploit Pro compiles workspace data logs, host statistics, and cracked credentials into customized reports suitable for presenting to executives, safety auditors, or IT compliance directors.
                    </p>
                    <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded text-xs">
                      <strong>Customizable sections:</strong>
                      <ul className="list-disc list-inside mt-1.5 space-y-1 text-[11px]">
                        <li>Remediation steps & patch links</li>
                        <li>Detailed penetration execution paths</li>
                        <li>Executive high-level graphs & pie charts</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* DOCKABLE PERSISTENT CONSOLE (Perfect for immediate interactions) */}
          <section className="bg-slate-900 border-t border-slate-800 text-slate-300 font-mono transition-all duration-300">
            <div className="px-6 py-2.5 bg-slate-950 flex justify-between items-center select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Terminal className="w-4 h-4 text-orange-500" /> msfconsole simulator
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <button
                  onClick={() => setIsConsoleMinimised(!isConsoleMinimised)}
                  className="hover:text-white transition-colors"
                >
                  {isConsoleMinimised ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isConsoleMinimised && (
              <div className="p-4 h-40 overflow-y-auto flex flex-col justify-between">
                <div className="flex-1 space-y-1 text-[11px] overflow-y-auto max-h-28">
                  {consoleLogs.slice(-6).map((log, index) => (
                    <pre key={index} className="whitespace-pre-wrap">
                      {log}
                    </pre>
                  ))}
                  <div ref={consoleBottomRef} />
                </div>

                <form onSubmit={handleConsoleSubmit} className="flex gap-2 pt-2 border-t border-slate-800 mt-2">
                  <span className="text-orange-500 font-bold select-none text-[11px]">
                    {msfCurrentPath ? `msf6 exploit(${msfCurrentPath.split('/').pop()}) >` : 'msf6 >'}
                  </span>
                  <input
                    type="text"
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    placeholder="Type help or console commands here..."
                    className="flex-1 bg-transparent text-slate-100 border-none focus:outline-none focus:ring-0 text-[11px] font-mono"
                  />
                </form>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* 1. SCAN MODAL CONFIGURATOR */}
      {modalType === 'scan' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Configure Discovery Scan Range</span>
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLaunchScan} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Target Address / Subnet Range</label>
                <input
                  type="text"
                  value={targetRange}
                  onChange={(e) => setTargetRange(e.target.value)}
                  placeholder="e.g. 192.168.1.0/24 or 10.0.0.12"
                  className="w-full bg-white border rounded px-3 py-2 text-xs font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Scan Intensity</label>
                <select className="w-full bg-white border rounded px-3 py-2 text-xs">
                  <option>Intense TCP Scan & Banner Resolution (Default)</option>
                  <option>Quick UDP/ICMP Host Discovery</option>
                  <option>OS Fingerprinting Resolution Mode</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded text-blue-800 space-y-1 leading-relaxed">
                <div className="font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Metasploit Pro db_nmap:
                </div>
                <div>This will call integrated nmap to populate hosts database list.</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="bg-white hover:bg-gray-50 border px-4 py-2 rounded font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Launch Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. BRUTEFORCE MODAL CONFIGURATOR */}
      {modalType === 'bruteforce' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Configure Bruteforce Attack</span>
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLaunchBruteforce} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Target Service Protocol</label>
                <select
                  value={bruteforceService}
                  onChange={(e) => setBruteforceService(e.target.value)}
                  className="w-full bg-white border rounded px-3 py-2 text-xs"
                >
                  <option value="SSH">SSH Server (Port 22)</option>
                  <option value="WINRM">WinRM Server (Port 5985)</option>
                  <option value="SMB">SMB Server (Port 445)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Dictionary / Wordlist</label>
                <input
                  type="text"
                  value={bruteforceWordlist}
                  onChange={(e) => setBruteforceWordlist(e.target.value)}
                  className="w-full bg-white border rounded px-3 py-2 text-xs font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded text-yellow-800 space-y-1 leading-relaxed border border-yellow-200">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /> Metasploit Auxiliary module:
                </div>
                <div>Attempts multiple login configurations against identified network hosts.</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="bg-white hover:bg-gray-50 border px-4 py-2 rounded font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#e95420] hover:bg-[#d84315] text-white px-4 py-2 rounded font-semibold"
                >
                  Start Bruteforce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EXPLOIT MODAL CONFIGURATOR */}
      {modalType === 'exploit' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-red-600" />
                <span>Configure Exploit Module Settings</span>
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLaunchExploit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Selected Module</label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full bg-white border rounded px-3 py-2 text-xs font-mono"
                >
                  {metasploitModules.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">RHOSTS (Target host address)</label>
                <input
                  type="text"
                  value={exploitTargetHost}
                  onChange={(e) => setExploitTargetHost(e.target.value)}
                  className="w-full bg-white border rounded px-3 py-2 text-xs font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">PAYLOAD (Simulated shell callback)</label>
                <input
                  type="text"
                  value={exploitPayload}
                  onChange={(e) => setExploitPayload(e.target.value)}
                  className="w-full bg-white border rounded px-3 py-2 text-xs font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="bg-red-50 p-3 rounded text-red-800 space-y-1 leading-relaxed border border-red-100">
                <div className="font-bold flex items-center gap-1">
                  <Play className="w-3.5 h-3.5 fill-current" /> Auto Reverse Listener:
                </div>
                <div>Payload stagers compile automatically to deliver active Meterpreter console access.</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="bg-white hover:bg-gray-50 border px-4 py-2 rounded font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Fire Exploit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. IMPORT MODAL */}
      {modalType === 'import' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-teal-600" />
                <span>Import Scan XML file</span>
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Download className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <span className="block text-gray-700 font-semibold mb-1">Drag and drop XML reports here</span>
                <span className="text-gray-500 text-[11px]">Supports Nmap XML, Nexpose report export, or Nessus output files</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setModalType(null)}
                  className="bg-white hover:bg-gray-50 border px-4 py-2 rounded font-semibold text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. REPORT MODAL */}
      {modalType === 'report' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Configure Standard Report PDF</span>
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Report Title / Project Name</label>
                <input
                  type="text"
                  defaultValue="Vulnerability Penetration Report - segment-scan"
                  className="w-full bg-white border rounded px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-medium">Included Information Modules</label>
                <div className="space-y-1 text-gray-600 font-medium">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Discovered target hosts and host attributes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Cracked passwords & hashes lists</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Successful Metasploit penetration paths (Meterpreter)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="bg-white hover:bg-gray-50 border px-4 py-2 rounded font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Generate PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
