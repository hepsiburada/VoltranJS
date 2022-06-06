import styled from 'styled-components';

const STATUS_COLOR = {
  live: '#8dc63f',
  dev: '#FF6000',
  page: '#00abff',
  1: '#9b59b6',
  2: '#c0392b',
  3: '#16a085'
};

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 20px;
`;

export const HeaderName = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: 10px;
`;

export const ListItem = styled.li`
  padding: 20px;
  display: inline-block;
  vertical-align: top;
  height: 120px;
  width: 240px;
  margin: 10px;
  cursor: pointer;
  border-radius: 10px;

  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);

  :after {
    content: '';
    border-radius: 10px;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    opacity: 0;
    -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  &:hover {
    transform: scale(1.02, 1.02);
    :after {
      opacity: 1;
    }
  }

  @media screen and (max-width: 600px) {
    display: block;
    width: auto;
    height: 150px;
    margin: 10px auto;
  }
`;

export const Link = styled.a`
  text-decoration: none;
  color: #49494a;

  &:before {
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    content: '';
  }
`;

export const Name = styled.span`
  font-weight: 800;
  display: block;
  max-width: 80%;
  font-size: 16px;
  line-height: 18px;
`;

export const Url = styled.span`
  font-size: 11px;
  line-height: 16px;
  color: #a1a1a4;
`;

export const Footer = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px;
  border-top: 1px solid ${({ status }) => (status && STATUS_COLOR[status]) || '#eeeeee'}50;
  font-size: 13px;
`;

export const Label = styled.span`
  font-size: 13px;
  align-items: center;
  font-weight: bold;
  display: flex;
  position: absolute;
  right: 20px;
  top: 0;
  line-height: 40px;
  margin: 0 10px;

  @media screen and (max-width: 200px) {
    right: auto;
    left: 10px;
  }

  color: ${({ status }) => (status && STATUS_COLOR[status]) || '#8dc63f'};
`;

export const Dot = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  overflow: hidden;
  border-radius: 50%;
  padding: 0;
  text-indent: -9999px;
  color: transparent;
  line-height: 16px;
  margin-left: 10px;
  background: ${({ status }) => (status && STATUS_COLOR[status]) || '#8dc63f'};
`;
