import styled from 'styled-components';

const STATUS_COLOR = {
  live: '#8dc63f',
  dev: '#FF6000'
};
export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const HeaderName = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: 10px;
`;

export const ListItem = styled.li`
  padding: 20px;
  border-radius: 2px;
  background: white;
  box-shadow: 0 2px 1px rgba(170, 170, 170, 0.25);
  position: relative;
  display: inline-block;
  vertical-align: top;
  height: 120px;
  width: 320px;
  margin: 10px;
  cursor: pointer;

  &:hover {
    background: #efefef;
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
  font-weight: 400;
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
  border-top: 1px solid #eee;
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
