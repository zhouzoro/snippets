Wv=8*pi/224.65;
We=8*pi/365.26;
Rv=1075;
Re=1496;
N=1000;
for t=1:1000
    Xv=Rv*cos(Wv*t);
    Yv=Rv*sin(Wv*t);
    Xe=Re*cos(We*t);
    Ye=Re*sin(We*t);
    x=[Xe,Xv];
    y=[Ye,Yv];
    plot(x,y)
    axis([-1500 1500 -1500 1500])
    axis equal
    hold on
    pause(0.01)
end