import { useState, useEffect, useRef, useCallback } from 'react';

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DEGRADED = 'DEGRADED',
}

interface ConnectionConfig {
  url: string;
  heartbeatInterval?: number;
}

export class ConnectionManager {
  private socket: WebSocket | null = null;
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private heartbeatIntervalId: number | null = null;
  private config: ConnectionConfig;
  private onStateChange: (state: ConnectionState) => void;

  constructor(config: ConnectionConfig, onStateChange: (state: ConnectionState) => void) {
    this.config = config;
    this.onStateChange = onStateChange;
  }

  public connect() {
    if (this.state === ConnectionState.CONNECTED || this.state === ConnectionState.CONNECTING) return;
    
    this.setState(ConnectionState.CONNECTING);
    this.socket = new WebSocket(this.config.url);

    this.socket.onopen = () => {
      console.log('[SOVR] WebSocket Connected');
      this.setState(ConnectionState.CONNECTED);
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.socket.onclose = () => {
      console.warn('[SOVR] WebSocket Disconnected');
      this.cleanup();
      this.scheduleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('[SOVR] WebSocket Error:', error);
      this.setState(ConnectionState.DEGRADED);
    };
  }

  private setState(state: ConnectionState) {
    this.state = state;
    this.onStateChange(state);
  }

  private startHeartbeat() {
    this.heartbeatIntervalId = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.config.heartbeatInterval || 5000);
  }

  private scheduleReconnect() {
    const delay = Math.min(500 * Math.pow(2, this.reconnectAttempts), 15000);
    const jitter = Math.random() * 1000;
    
    console.log(`[SOVR] Scheduling reconnect in ${delay + jitter}ms`);
    
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay + jitter);
  }

  private cleanup() {
    if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId);
    this.socket = null;
    this.setState(ConnectionState.DISCONNECTED);
  }
}
