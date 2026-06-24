/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Host {
  id: string;
  ip: string;
  name: string;
  mac: string;
  os: 'Linux' | 'Windows' | 'embedded' | 'RTOS' | 'Unknown';
  status: 'Discovered' | 'Cracked' | 'Shelled' | 'Looted';
  discoveredAt: string;
}

export interface Service {
  id: string;
  hostId: string;
  hostIp: string;
  port: number;
  protocol: 'tcp' | 'udp';
  name: string; // SSH, MS-WBT-SERVER, WINRM, POP, HTTPS, HTTP, SMB, etc.
  banner: string;
  status: 'active' | 'exploited';
}

export interface Vulnerability {
  id: string;
  hostId: string;
  hostIp: string;
  cve: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  applicableModule: string;
  exploited: boolean;
}

export interface Credential {
  id: string;
  hostIp: string;
  service: string;
  username: string;
  privateType: 'Password' | 'NTLM Hash' | 'SSH Key' | 'Hash';
  privateValue: string;
  cracked: boolean;
  capturedAt: string;
}

export interface ActiveSession {
  id: number;
  hostIp: string;
  type: 'shell' | 'meterpreter';
  platform: string;
  port: number;
  openedAt: string;
  status: 'active' | 'closed';
}

export interface Task {
  id: string;
  name: string; // Scan, Bruteforce, Exploit, WebScan
  status: 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  target: string;
  startedAt: string;
}

export type ActiveTab =
  | 'Dashboard'
  | 'Hosts'
  | 'Services'
  | 'Vulnerabilities'
  | 'Credentials'
  | 'Sessions'
  | 'Topology'
  | 'Console'
  | 'WebApps'
  | 'Modules'
  | 'Tasks'
  | 'Reports';
